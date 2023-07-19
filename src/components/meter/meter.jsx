import React, { useState } from "react";
import {
  add,
  createMeter,
  updateMeter,
  updateSingleMeter,
  viewMeter,
  descMeter,
  deleteMeter,
  ascMeter,
  oneDayPrevious,
  oneDayNext,
} from "../../api/endpoints/meter";
import SideBar from "../sidebar/sideBar";
import { AiFillSave } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { AiFillFileAdd } from "react-icons/ai";
import { BiExit } from "react-icons/bi";
import Header from "../header/header";
// import { toastSuccess, toastError } from "../../api/integrations/toaster";
import "./meter.css";
import { useSelector } from "react-redux";
import { authSelector } from "../../store/selectors/index";
import { useEffect } from "react";
import { EMeters } from "../../enums/meters";
import { Modal, message } from "antd";

const Meter = () => {
  const { user, access_token } = useSelector(authSelector);
  const [type, setType] = useState("");
  const [typeLast, setTypeLast] = useState("");
  const [addData, setAddData] = useState([]);
  const [dateEntered, setDateEntered] = useState("");
  const [shift, setShift] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const clearStates = () => {
    setIsVisible(true);
    setAddData([]);
    setShift("");
    setType("");
    setTypeLast("");
    setDateEntered("");
    setTotalPetrol(0);
    setTotalHI(0);
    setTotalDiesel(0);
    setMQtyPetrol(0);
    setMQtyHI(0);
    setMQtyDiesel(0);
  };

  function entryHandler(value, i, name) {
    const currentObj = addData[i].meter
      ? addData[i].meter
      : { meterStarting: 0, meterEnding: 0, meterCheck: 0 };
    const sum =
      name === "meterStarting"
        ? Number(currentObj.meterEnding || 0) -
        Number(value) -
        Number(currentObj.meterCheck || 0)
        : name === "meterEnding"
          ? Number(value) -
          Number(currentObj.meterStarting || 0) -
          Number(currentObj.meterCheck || 0)
          : name === "meterCheck"
            ? Number(currentObj.meterEnding || 0) -
            Number(currentObj.meterStarting || 0) -
            Number(value)
            : 0;

    const findIndex = addData[i];
    const modifiedObject = {
      ...findIndex,
      meter: { ...findIndex.meter, [name]: value, quantity: sum.toFixed(2) },
    };
    console.log(modifiedObject, "modieeee");
    addData[i] = modifiedObject;
    setAddData([...addData]);
  }

  function eMEntryHandler(value, i, name) {
    const currentObj = addData[i].meter
      ? addData[i].meter
      : { electronicStarting: 0, electronicEnding: 0 };
    const sum =
      name === "electronicStarting"
        ? Number(currentObj.electronicEnding || 0) - Number(value)
        : name === "electronicEnding"
          ? Number(value) - Number(currentObj.electronicStarting || 0)
          : 0;

    const findIndex = addData[i];
    const modifiedObject = {
      ...findIndex,
      meter: { ...findIndex.meter, [name]: value, eQuantity: sum.toFixed(2) },
    };
    console.log(modifiedObject, "modieeee");
    addData[i] = modifiedObject;
    setAddData([...addData]);
  }

  const [totalPetrol, setTotalPetrol] = useState(0);
  const [totalHI, setTotalHI] = useState(0);
  const [totalDiesel, setTotalDiesel] = useState(0);

  const [mQtyPetrol, setMQtyPetrol] = useState(0);
  const [mQtyHI, setMQtyHI] = useState(0);
  const [mQtyDiesel, setMQtyDiesel] = useState(0);

  useEffect(() => {
    if (addData.length === 0) return;

    let petrols = addData.filter((el) => el.tank?.item?.itemCode === 1) || [];
    if (petrols.length === 0) {
      setMQtyPetrol(0);
      setTotalPetrol(0);
    } else {
      let petrolsSum = petrols.reduce(
        (arr, curr) => arr + Number(curr.meter?.quantity || 0),
        0
      );
      setMQtyPetrol(Number(petrolsSum));
      setTotalPetrol(
        Number(
          Number(petrolsSum) * Number(petrols[0].tank.item.saleRate)
        ).toFixed(2)
      );
    }

    // diesel
    let diesels = addData.filter((el) => el.tank?.item?.itemCode === 2) || [];
    if (diesels.length === 0) {
      setMQtyDiesel(0);
      setTotalDiesel(0);
    } else {
      let dieselsSum = diesels.reduce(
        (arr, curr) => arr + Number(curr.meter?.quantity || 0),
        0
      );
      setMQtyDiesel(Number(dieselsSum));
      setTotalDiesel(
        Number(
          Number(dieselsSum) * Number(diesels[0]?.tank?.item?.saleRate)
        ).toFixed(2)
      );
    }

    // for HI
    let hI = addData.filter((el) => el.tank?.item?.itemCode === 3) || [];
    if (hI.length === 0) {
      setMQtyHI(0);
      setTotalHI(0);
    } else {
      let hISum = hI.reduce(
        (arr, curr) => arr + Number(curr.meter?.quantity || 0),
        0
      );
      setMQtyHI(Number(hISum));
      setTotalHI(
        Number(Number(hISum) * Number(hI[0].tank.item.saleRate)).toFixed(2)
      );
    }
  }, [addData]);

  function getDate(e) {
    setDateEntered(e.target.value);
    setType("");
  }
  function getShift(e) {
    setShift(e.target.value);
  }

  const addMeter = async () => {
    if (!shift) return message.error("Please type shift!");
    if (!dateEntered) return message.error("Please type Date!");
    let data = {
      enteredOn: dateEntered,
      shift,
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
              meter: {
                ...curr.meter,
                meterStarting: curr.meter?.meterEnding || 0,
                meterCheck: 0,
                quantity: 0,
                electronicStarting: curr.meter?.electronicEnding || 0,
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
  const save = async () => {
    if (!shift) return message.error("Please type shift!");

    const payload = addData.reduce((acc, curr) => {
      return [
        ...acc,
        {
          enteredOn: dateEntered, //slected date
          shift: Number(shift), // user input
          itemCode: Number(curr.tank.item.itemCode),
          saleRate: Number(curr.tank.item.saleRate),
          tankNumber: curr.tank.tankNumber,
          meterStarting: Number(curr.meter.meterStarting),
          meterEnding: Number(
            curr.meter.meterEnding || curr.meter.meterStarting
          ),
          electronicStarting: Number(curr.meter.electronicStarting),
          electronicEnding: Number(
            curr.meter.electronicEnding || curr.meter.electronicStarting
          ),
          nozelNumber: curr.nozelNumber,
          grpId: Number(user.grpId),
          siteId: Number(user.siteId),
          companyCode: Number(user.companyCode),
          quantity: Number(curr.meter.quantity), //M-QTY,
          eQuantity: Number(curr.meter.eQuantity), //E-QTY,
          meterCheck: Number(curr.meter.meterCheck || 0),
        },
      ];
    }, []);
    console.log(payload, "payload");
    const result = await createMeter(payload, access_token);
    if (result.success) {
      message.success(result.message || "Successfully entered!");
      clearStates();
    }
  };

  // -------------- EDIT

  const edit = async () => {
    if (!shift) return message.error("Please type shift!");
    if (!dateEntered) return message.error("Please type Date!");

    let data = {
      enteredOn: dateEntered,
      shift: shift,
    };
    const result = await updateMeter(data, access_token);
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
      meterStarting: Number(reading.meter.meterStarting),
      meterEnding: Number(reading.meter.meterEnding),
      quantity: Number(reading.meter.quantity),
      meterCheck: Number(reading.meter.meterCheck),
      id: reading.meter.id,
    };
    const response = await updateSingleMeter(data, access_token);
    if (response.success) {
      message.success("Updated !");
    }
  };

  // ----------------- DELETE
  const [modal, contextHolder] = Modal.useModal();
  const deleteMeterApi = async () => {
    const payload = {
      date: dateEntered,
      shift: shift,
    };
    const results = await deleteMeter(payload, access_token);
    if (results.success) {
      message.success("Record Deleted Successfully !");
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
    if (!shift) return message.error("Please type shift!");
    if (!dateEntered) return message.error("Please type Date!");

    const payload = {
      enteredOn: dateEntered,
      shift,
    };
    const result = await viewMeter(payload, access_token);
    if (result.success) {
      setAddData(result.data);
      confirmDelete();
    } else {
      message.warning(result.message);
    }
  };

  const orderByDesc = async () => {
    const result = await descMeter(access_token);
    if (result.success) {
      setAddData(result.data);
      setDateEntered(result.data[0].enteredOn);
      setShift(result.data[0].meter.shift);
      setTypeLast(EMeters.LAST);
    } else {
      message.warning(result.message);
    }
  };

  const orderByAsc = async () => {
    const result = await ascMeter(access_token);
    if (result.success) {
      setAddData(result.data);
      setDateEntered(result.data[0].enteredOn);
      setShift(result.data[0].meter.shift);
      setTypeLast(EMeters.LAST);
    } else {
      message.warning(result.message);
    }
  };
  const onePreDate = async () => {
    const payload = {
      enteredOn: dateEntered,
      shift,
    };
    const result = await oneDayPrevious(payload, access_token);
    if (result.success) {
      setAddData(result.data);
      setDateEntered(result.data[0].enteredOn);
      setShift(result.data[0].meter.shift);
    } else {
      message.warning(result.message);
    }
  };

  const oneNextDate = async () => {
    const payload = {
      enteredOn: dateEntered,
      shift,
    };
    const result = await oneDayNext(payload, access_token);
    if (result.success) {
      setAddData(result.data);
      setDateEntered(result.data[0].enteredOn);
      setShift(result.data[0].meter.shift);
    } else {
      message.warning(result.message);
    }
  };

  return (
    <div className="flex  bg-black main ">
      {/* <SideBar /> */}
      <div className="h-full  flex flex-col content-center  w-full">
        {/* <Header /> */}
        <div className="meterTableMain ml-10 mt-6o mr-10">
          <h3 className="bg-blue-500 text-white tableHeading pl-10">
            METER READINGS
          </h3>
          {contextHolder}
          <div className="div">
            <div className="flex">
              <div className="overflow-x-auto   shadow-md sm:rounded-lg tableDiv p-5   w-full">
                <div className="flex content-center mb-3 ">
                  <input
                    type="date"
                    name=""
                    id=""
                    onChange={getDate}
                    value={dateEntered}
                    className="inpTxt dateInp bg-black  text-slate-400 p-2 h-8 "
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="Shift"
                    onChange={getShift}
                    value={shift}
                    className="inpTxt bg-black text-white p-1 h-8 ml-3 w-28"
                  />
                  <input
                    readOnly
                    value={user.id}
                    className="inpTxt bg-black text-slate-400 p-1 h-8 ml-3 w-28"
                  />
                  <input
                    value={user.name}
                    className="inpTxt bg-black text-slate-400 p-1 h-8 ml-3 w-96"
                  />
                  <input
                    type="text"
                    name=""
                    id=""
                    placeholder="Report"
                    className="inpTxt bg-black text-white p-1 h-8 ml-3"
                  />
                </div>
                <div style={{ overflow: "auto", maxHeight: "400px" }}>
                  <div style={{ position: "sticky", top: "0" }}>
                    <table className="table w-full text-sm text-left text-gray-500 dark:text-gray-400">
                      <thead className="bg-blue-500 text-white  dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th
                            className="pl-3  pr-2 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider "
                            scope="col"
                          >
                            SNo.
                          </th>
                          <th
                            className="  pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                            scope="col"
                          >
                            NZN
                          </th>
                          <th
                            className="  pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                            scope="col"
                          >
                            PRODUCT
                          </th>
                          {user.role === "admin" && (
                            <th
                              className="   pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                              scope="col"
                            >
                              OPENING
                            </th>
                          )}

                          <th
                            className="  pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                            scope="col"
                          >
                            CLOSING
                          </th>
                          {user.role === "admin" && (
                            <th
                              className="   pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                              scope="col"
                            >
                              E-OPENING
                            </th>
                          )}
                          <th
                            className="   pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                            scope="col"
                          >
                            E-CLOSING
                          </th>
                          <th
                            className="  pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                            scope="col"
                          >
                            Re-Tank
                          </th>
                          <th
                            className="  pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                            scope="col"
                          >
                            M-Qty
                          </th>
                          <th
                            className="  pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                            scope="col"
                          >
                            E-Qty
                          </th>
                          <th
                            className="  pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                            scope="col"
                          >
                            Rate
                          </th>
                          <th
                            className="  pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                            scope="col"
                          >
                            TANK
                          </th>
                          {type === EMeters.EDIT && (
                            <th
                              className="  pl-2 pr-2 fs-15 py-3   bg-blue-500  text-left text-xs font-medium   "
                              scope="col"
                            >
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
                                <td className=" pl-3 pt-3 pb-3 pr-1">
                                  {i + 1}
                                  {/* <input
                                type="hidden"
                                id="enteredDate"
                                className="enteredDate"
                                value={dateEntered}
                              />
                              <input
                                type="hidden"
                                id="shiftId"
                                className="shiftId "
                                value={shift}
                              /> */}
                                  {/* <input
                                type="hidden"
                                id="salemanName"
                                className="salemanName text-slate-400"
                              /> */}
                                </td>
                                <td className="pt-3 pb-3  pl-2 pr-1 ">
                                  {ele.nozelNumber}
                                  {/* <input
                                type="hidden"
                                id="NZNInp"
                                className="NZNInp"
                                value={ele.NZN}
                              /> */}
                                </td>
                                <td className="pt-3 pb-3  pl-2 pr-1">
                                  {ele.tank.item.itemName}
                                  {/* <input
                                type="hidden"
                                id="ProductInp"
                                className="ProductInp"
                                value={ele.ICODE}
                              /> */}
                                </td>
                                {user.role === "admin" && (
                                  <td
                                    className="pt-3 pb-3 pl-2 pr-1"
                                    type="text"
                                  >
                                    <input
                                      type="text"
                                      placeholder="Opening"
                                      defaultValue={
                                        ele.meter?.meterStarting || ""
                                      }
                                      onChange={(e) =>
                                        entryHandler(
                                          e.target.value,
                                          i,
                                          "meterStarting"
                                        )
                                      }
                                      id="mst"
                                      className=" mst w-78  text-white placeholder:text-slate-400"
                                    />
                                  </td>
                                )}
                                <td className="pt-3 pb-3  pl-2 pr-1">
                                  <input
                                    type="text"
                                    placeholder="Closing"
                                    onChange={(e) =>
                                      entryHandler(
                                        e.target.value,
                                        i,
                                        "meterEnding"
                                      )
                                    }
                                    defaultValue={ele.meter?.meterEnding || ""}
                                    id="mend"
                                    className=" w-78 mend  text-white placeholder:text-slate-400"
                                  />
                                </td>
                                {user.role === "admin" && (
                                  <td
                                    className="pt-3 pb-3  pl-2 pr-1"
                                    type="text"
                                  >
                                    <input
                                      type="text"
                                      placeholder="Electronic Opening"
                                      defaultValue={
                                        ele.meter?.electronicStarting || ""
                                      }
                                      onChange={(e) =>
                                        eMEntryHandler(
                                          e.target.value,
                                          i,
                                          "electronicStarting"
                                        )
                                      }
                                      id="mst"
                                      className="w-78  mst  text-white placeholder:text-slate-400"
                                    />
                                  </td>
                                )}
                                <td className="pt-3 pb-3  pl-2 pr-1">
                                  <input
                                    type="text"
                                    placeholder="Electronic Closing"
                                    onChange={(e) =>
                                      eMEntryHandler(
                                        e.target.value,
                                        i,
                                        "electronicEnding"
                                      )
                                    }
                                    value={ele.meter?.electronicEnding || ""}
                                    id="mend"
                                    className=" mend w-78  text-white placeholder:text-slate-400"
                                  />
                                </td>
                                <td className="pt-3 pb-3  pl-2 pr-1">
                                  <input
                                    type="text"
                                    placeholder="Re-Tank"
                                    name=""
                                    id=""
                                    className="reTank w-78  text-white w-14 placeholder:text-slate-400"
                                    value={ele.meter?.meterCheck || ""}
                                    onChange={(e) =>
                                      entryHandler(
                                        e.target.value,
                                        i,
                                        "meterCheck"
                                      )
                                    }
                                  />
                                </td>
                                <td className="pt-3 pb-3 w-78  pl-2 pr-1 text-center">
                                  {ele.meter?.quantity}
                                </td>
                                <td className="pt-3 pb-3 w-78  pl-2 pr-1">
                                  {ele.meter?.eQuantity}
                                </td>
                                <td className="pt-3 pb-3  pl-2 pr-1">
                                  {ele.tank.item.saleRate}
                                  <input
                                    type="hidden"
                                    className="SRate w-28"
                                    value={ele.SRATE}
                                  />
                                </td>
                                <td className="pt-3 pb-3  pl-2 pr-1">
                                  {ele.tank.tankNumber}
                                  <input
                                    type="hidden"
                                    className="TNOInp w-28"
                                    value={ele.TNO}
                                  />
                                </td>
                                {type === EMeters.EDIT && (
                                  <td className="pt-3 pb-3  pl-2 pr-1">
                                    <button
                                      className="bg-blue-500 hover:bg-blue-700 text-white flex mt-3 py-1 px-4 rounded"
                                      style={{
                                        border: "1px solid",
                                        padding: "5pxs",
                                      }}
                                      onClick={() => updateSingleHandler(ele)}
                                    >
                                      <AiFillFileAdd className="mr-2 mt-1" />

                                      <span>save</span>
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
                  </div>
                </div>
                <input
                  type="text"
                  readOnly
                  placeholder=""
                  name=""
                  id=""
                  value={`Petrol : ${mQtyPetrol} Liters , ${totalPetrol} - Diesel : ${mQtyDiesel} Liters , ${totalDiesel} - Hi Octane : ${mQtyHI} Liters , ${totalHI}`}
                  className="mt-2 p-1 w-full bg-black text-slate-400 outline-none"
                />
                <div className="flex justify-between">
                  <div className="flex">
                    {type === EMeters.ADD || type === EMeters.EDIT ? null : (
                      <button
                        onClick={addMeter}
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
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 flex items-center rounded"
                      >
                        <AiFillSave className="mr-2 " />
                        <span>Save</span>
                      </button>
                    )}
                    {isVisible && type !== EMeters.EDIT && (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white flex mt-3 ml-3 py-1 px-4 rounded"
                        onClick={edit}
                      >
                        {" "}
                        <AiFillEdit className="mr-2 mt-1" />
                        <span>Edit</span>
                      </button>
                    )}

                    {isVisible && type !== EMeters.EDIT && (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white flex mt-3 ml-3 py-1 px-4 rounded"
                        onClick={deleteMeterHandler}
                      >
                        <AiFillDelete className="mr-2 mt-1" />

                        <span>Delete</span>
                      </button>
                    )}

                    <button
                      onClick={clearStates}
                      className="bg-blue-500 hover:bg-blue-700 text-white flex mt-3 ml-3 py-1 px-4 rounded"
                    >
                      <BiExit className="mr-2 mt-1" />
                      {type === EMeters.EDIT ? "Done" : "Exit"}
                    </button>
                  </div>
                  {/* <div className="flex content-end mt-3 bg-white justify-end" style={{
                    width: '40rem'
                  }}>
                    <input
                      type="text"
                      readOnly
                      // placeholder="Total Amount"
                      name=""
                      id=""
                      className="p-3 w-full h-8 bg-black text-slate-400 outline-none"
                      disabled={true}
                    // value={`The Total Amount Of Petrol is ${totalPetrol} and HI is ${totalHI}`}

                    />

                  </div> */}
                  {isVisible && (
                    <div>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                        onClick={orderByAsc}
                      >
                        <img src={`./img/first.png`} alt="" />
                      </button>
                      {typeLast === "LAST" && (
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                          onClick={onePreDate}
                        >
                          <img src={`./img/previous.png`} alt="" />
                        </button>
                      )}
                      {typeLast === "LAST" && (
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                          onClick={oneNextDate}
                        >
                          <img src={`./img/next.png`} alt="" />
                        </button>
                      )}
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                        onClick={orderByDesc}
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

export default Meter;
