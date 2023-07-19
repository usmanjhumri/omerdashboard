import React, { useState } from "react";
import {
  add,
  updateDip,
  getSingleDip,
  createDip,
  descDip,
  ascDip,
  updateSingleDip,
  viewDip,
  deleteDip,
  oneDayNext,
  oneDayPrevious,
} from "../../api/endpoints/dip";
import SideBar from "../sidebar/sideBar";
import Header from "../header/header";
import { useSelector } from "react-redux";
import { authSelector } from "../../store/selectors/index";
// import { useEffect } from "react";
import { EMeters } from "../../enums/meters";
import { Modal, message } from "antd";
// import ReactToPrint from 'react-to-print';
import "./dip.css";
import { AiFillSave } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { AiFillFileAdd } from "react-icons/ai";
import { BiExit } from "react-icons/bi";
const Dip = () => {
  const { user, access_token } = useSelector(authSelector);
  const [type, setType] = useState("");
  const [typeLast, setTypeLast] = useState("");
  const [addData, setAddData] = useState([]);
  const [dateEntered, setDateEntered] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const clearStates = () => {
    setIsVisible(true);
    setAddData([]);
    setType("");
    setDateEntered("");
    setTypeLast("");
  };

  function entryHandler(value, i, name) {
    const findIndex = addData[i];
    const modifiedObject = {
      ...findIndex,
      dip: { ...findIndex.dip, [name]: value },
    };
    addData[i] = modifiedObject;
    setAddData([...addData]);
    getDip(value, i, name);
  }
  console.log(addData, "addData");

  function getDate(e) {
    setDateEntered(e.target.value);
  }

  const addDip = async () => {
    if (!dateEntered) return message.error("Please type Date!");
    let data = {
      enteredOn: dateEntered,
    };

    const result = await add(data, access_token);
    if (result.success) {
      if (result.data.length > 0) {
        setIsVisible(false);
        const definedData = result.data.reduce(
          (arr, curr) => [
            ...arr,
            {
              ...curr,
              dip: {
                ...curr.dip,
                mmOpening: curr.dip?.mmClosing || 0,
                quantityOpening: curr.dip?.quantityClosing || 0,
                mmClosing: 0,
                quantityClosing: 0,
              },
            },
          ],
          []
        );
        console.log(result.data, "-----", definedData);
        setAddData(definedData);
        setType(EMeters.ADD);
      }
    } else {
      message.error(result.message);
    }
  };

  const getDip = async (value, i, name) => {
    const findDipIndex = addData[i];
    const modifiedDipObject = {
      ...findDipIndex,
      dip: { ...findDipIndex.dip, [name]: value },
    };
    addData[i] = modifiedDipObject;
    setAddData([...addData]);
    console.log(findDipIndex, "this add adat");
    const dipMm = modifiedDipObject.dip.mmClosing;
    const tankNumber = modifiedDipObject.tankNumber;
    console.log(dipMm, tankNumber, "hasdhajsh");

    let data = {
      dipMm: Number(dipMm),
      tankNumber: tankNumber,
    };
    console.log(data, "this is data");

    const result = await getSingleDip(data, access_token);
    if (result.success) {
      const findDipMmIndex = addData[i];
      const modifiedDipMmObject = {
        ...findDipMmIndex,
        dip: { ...findDipMmIndex.dip, quantityClosing: result.data },
      };
      addData[i] = modifiedDipMmObject;
      setAddData([...addData]);
      console.log(result.data, "resss");
    } else {
      message.error(result.message);
    }
  };

  const save = async () => {
    const payload = addData.reduce((acc, curr) => {
      return [
        ...acc,
        {
          enteredOn: dateEntered, //slected date
          itemCode: Number(curr.item.itemCode),
          tankNumber: curr.tankNumber,
          mmOpening: Number(curr.dip.mmOpening),
          quantityOpening: Number(curr.dip.quantityOpening),
          mmClosing: Number(curr.dip.mmClosing || curr.dip.mmClosing),
          quantityClosing: Number(curr.dip.quantityClosing),
          grpId: Number(user.grpId),
          siteId: Number(user.siteId),
          companyCode: Number(user.companyCode),
        },
      ];
    }, []);
    const result = await createDip(payload, access_token);
    if (result.success) {
      message.success(result.message || "Successfully entered!");
      clearStates();
    }
  };

  const edit = async () => {
    if (!dateEntered) return message.error("Please type Date!");

    let data = {
      enteredOn: dateEntered,
    };
    const result = await updateDip(data, access_token);
    if (result.success) {
      // toastSuccess("Successfully entered")
      setAddData(result.data);
      setType(EMeters.EDIT);
    } else {
      message.error(result.message);
    }
  };

  // -------------- UPDATE

  const updateSingleHandler = async (reading) => {
    console.log(reading);
    const data = {
      mmClosing: Number(reading.dip.mmClosing),
      quantityClosing: Number(reading.dip.quantityClosing),
      id: reading.dip.id,
    };
    const response = await updateSingleDip(data, access_token);
    if (response.success) {
      message.success("Updated !");
    }
  };

  // ----------------- DELETE
  const [modal, contextHolder] = Modal.useModal();
  const deleteMeterApi = async () => {
    const payload = {
      date: dateEntered,
    };
    const results = await deleteDip(payload, access_token);
    if (results.success) {
      message.success(results.message || "Record Deleted Successfully !");
      clearStates();
    } else {
      message.error(results.message);
    }
  };
  const confirmDelete = () => {
    modal.confirm({
      title: `Confirm`,
      content: "Are you sure you want to delete this record?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: deleteMeterApi,
    });
  };

  const deleteMeterHandler = async () => {
    if (!dateEntered) return message.error("Please type Date!");

    const payload = {
      enteredOn: dateEntered,
    };
    const result = await viewDip(payload, access_token);
    if (result.success) {
      setAddData(result.data);
      confirmDelete();
    } else {
      message.warning(result.message);
    }
  };

  const orderByDesc = async () => {
    const result = await descDip(access_token);
    if (result.success) {
      setAddData(result.data);
      setDateEntered(result.data[0].dip.enteredOn);
      setTypeLast(EMeters.LAST);
    } else {
      message.warning(result.message);
    }
  };

  const orderByAsc = async () => {
    const result = await ascDip(access_token);
    if (result.success) {
      setAddData(result.data);
      setDateEntered(result.data[0].dip.enteredOn);
      setTypeLast(EMeters.LAST);
    } else {
      message.warning(result.message);
    }
  };

  const onePreDate = async () => {
    const payload = {
      enteredOn: dateEntered,
    };
    const result = await oneDayPrevious(payload, access_token);
    if (result.success) {
      setAddData(result.data);
      setDateEntered(result.data[0].dip.enteredOn);
    } else {
      message.warning(result.message);
    }
  };

  const oneNextDate = async () => {
    const payload = {
      enteredOn: dateEntered,
    };
    const result = await oneDayNext(payload, access_token);
    if (result.success) {
      setAddData(result.data);
      setDateEntered(result.data[0].dip.enteredOn);
    } else {
      message.warning(result.message);
    }
  };

  return (
    <div className="flex  bg-black main ">
      <SideBar />
      <div className="h-full  flex flex-col content-center  w-full">
        <Header />
        <div className="meterTableMain ml-10 mt-6o mr-10">
          <h3 className="heading bg-blue-500 text-white tableHeading pl-10">
            DAY CLOSING DIPS
          </h3>
          {contextHolder}
          <div className="div">
            <div className="flex content-center pt-5">
              <input
                type="date"
                name=""
                id=""
                onChange={getDate}
                value={dateEntered}
                className="dateInp inpTxt bg-black  text-slate-400 p-2 h-8 ml-11"
              />
            </div>
            <div className="flex">
              <div className="overflow-x-auto   shadow-md sm:rounded-lg tableDiv p-5 pl-10  w-full">
                <table className=" table w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="bg-blue-500 text-white uppercase dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium " scope="col">
                        SNo.
                      </th>
                      <th className="pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium " scope="col">
                        TANK NO.
                      </th>
                      <th className="pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium " scope="col">
                        OPENING DIP
                      </th>
                      <th className="w-1/5 pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium " scope="col">
                        OPENING QTY
                      </th>
                      <th className="w-1/5 pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium " scope="col">
                        CLOSING DIP
                      </th>
                      <th className="w-1/5 pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium" scope="col">
                        CLOSING QTY
                      </th>
                      <th className="pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium " scope="col">
                        PRODUCT
                      </th>
                      {type === EMeters.EDIT && (
                        <th className="pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium " scope="col">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="tableBody">
                    {addData.length > 0 ? (
                      addData.map((ele, i) => {
                        return (
                          <tr key={i} className="tbodyData">
                            <td className="pt-3 pb-3  pl-2 pr-1">
                              {i + 1}
                              <input
                                type="hidden"
                                id="enteredDate"
                                className="enteredDate"
                                value={dateEntered}
                              />
                            </td>
                            <td className="pt-3 pb-3  pl-2 pr-1">{ele.tankNumber}</td>
                            <td className="pt-3 pb-3  pl-2 pr-1" type="text">
                              <input
                                type="text"
                                placeholder="Opening"
                                value={ele.dip?.mmOpening || 0}
                                // onChange={(e) =>
                                //   entryHandler(
                                //     e.target.value,
                                //     i,
                                //     "mmOpening"
                                //   )
                                // }
                                id="mst"
                                className=" mst  text-white placeholder:text-slate-400"
                              />
                            </td>
                            <td className="pt-3 pb-3  pl-2 pr-1" type="text">
                              <input
                                type="text"
                                placeholder="Opening"
                                value={ele.dip?.quantityOpening || 0}
                                // onChange={(e) =>
                                //   entryHandler(
                                //     e.target.value,
                                //     i,
                                //     "quantityOpening"
                                //   )
                                // }
                                id="mst"
                                className=" mst  text-white placeholder:text-slate-400"
                              />
                            </td>
                            <td className="pt-3 pb-3  pl-2 pr-1">
                              <input
                                type="text"
                                placeholder="Closing"
                                onChange={(e) =>
                                  entryHandler(e.target.value, i, "mmClosing")
                                }
                                value={ele.dip?.mmClosing || 0}
                                id="mend"
                                className=" mend  text-white placeholder:text-slate-400"
                              />
                            </td>
                            <td className="pt-3 pb-3  pl-2 pr-1">
                              <input
                                type="text"
                                placeholder="Closing"
                                // onChange={(e) =>
                                //   entryHandler(e.target.value, i, "quantityClosing")
                                // }
                                value={ele.dip?.quantityClosing || 0}
                                id="mend"
                                className=" mend  text-white placeholder:text-slate-400"
                              />
                            </td>

                            <td className="pt-3 pb-3  pl-2 pr-1">
                              {ele.item.itemName}
                              <input
                                type="hidden"
                                id="ProductInp"
                                className="ProductInp"
                                value={ele.ICODE}
                              />
                            </td>
                            {type === EMeters.EDIT && (
                              <td className="pt-3 pb-3  pl-2 pr-1">
                                <button
                                className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 flex items-center rounded"
                 
                                  style={{
                                    border: "1px solid",
                                    padding: "5pxs",
                                  }}
                                  onClick={() => updateSingleHandler(ele)}
                                >
                                   <AiFillSave className="mr-2 " />
                    <span>Save</span>
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
                <div className="flex justify-between mt-4">

                  <div className="flex">
                    {type === EMeters.ADD || type === EMeters.EDIT ? null : (
                      <button
                        onClick={addDip}
                        className="bg-blue-500 hover:bg-blue-700 text-white flex mt-3 py-1 px-4 rounded"
                        disabled={type === EMeters.ADD}
                      >
                        <AiFillFileAdd className="mr-2 mt-1" />
                        <span>Add</span>
                      </button>
                    )}

                    {type === EMeters.ADD && (
                      <button
                        onClick={save}
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 flex items-center rounded"
                      >
                     <AiFillSave className="mr-2 " />
                    <span>Save</span>
                      </button>
                    )}
                    {isVisible &&  type !== EMeters.EDIT && (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 flex items-center rounded"
                        onClick={edit}
                      >
                        <AiFillEdit className="mr-2 mt-1" />
                        
                        <span>Edit</span>
                      </button>
                    )}

                    {isVisible && type !== EMeters.EDIT && (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 flex items-center rounded"
                        onClick={deleteMeterHandler}
                      >
                      <AiFillDelete className="mr-2 " />
                        
                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      onClick={clearStates}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 flex items-center rounded"
                    >
                        <BiExit className="mr-2 " />
                      {type === EMeters.EDIT ? "Done" : "Exit"}
                    </button>
                  </div>
{isVisible && (
                  <div>
                    <button
                      onClick={orderByAsc}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                    >
                      <img src={`./img/first.png`} alt="" />
                    </button>
                    {typeLast === "LAST" && (
                      <button
                        onClick={onePreDate}
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                      >
                        <img src={`./img/previous.png`} alt="" />
                      </button>
                    )}
                    {typeLast === "LAST" && (
                      <button
                        onClick={oneNextDate}
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                      >
                        <img src={`./img/next.png`} alt="" />
                      </button>
                    )}
                    <button
                      onClick={orderByDesc}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      <img src={`./img/latest.png`} alt="" />
                    </button>
                  </div>
)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dip;
