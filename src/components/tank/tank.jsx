import React, { useEffect, useState } from "react";
import {
  createTank,
  deleteSingleTank,
  getAllTankForEdit,
  updateSingleTank,
} from "../../api/endpoints/tank.js";
import { authSelector } from "../../store/selectors/index";
import { useSelector } from "react-redux";
import { Modal, message, Select } from "antd";
import SideBar from "../sidebar/sideBar";
import Header from "../header/header";
import { getAllItem } from "../../api/endpoints/tank";
const { Option } = Select;

const Tank = () => {
  const { user, access_token } = useSelector(authSelector);
  const [fieldsShow, setFieldsShow] = useState(false);
  const [type, setType] = useState("ADD");
  const [state, setState] = useState({
    id: "",
    tankNumber: "",
    items: [],
    tanks: [],
    itemCode: "",
    printOrder: "",
    closed: "",
  });

  const clearState = () => {
    setState({
      id: "",
      tankNumber: "",
      items: state.items,
      tanks: state.tanks,
      itemCode: "",
      printOrder: "",
      closed: "",
    });
  };

  const onChangeText = (e, object) => {
    if (object) {
      const { name, value } = object;
      setState({
        ...state,
        [name]: value,
      });
    } else {
      const { name, value } = e.target;
      setState({
        ...state,
        [name]: value,
      });
    }
  };
  const addTank = async () => {
    setType("SAVE");
    setFieldsShow(true);
  };
  const saveTank = async (e) => {
    if (!state.itemCode || !state.tankNumber) {
      return message.error(
        `Please type ${
          !state.itemCode
            ? "Item Number"
            : !state.tankNumber
            ? "Tank Number"
            : ""
        }`
      );
    }
    const payload = {
      tankNumber: state.tankNumber,
      printOrder: Number(state.printOrder),
      itemCode: Number(state.itemCode),
      closed: Number(state.closed),
      grpId: Number(user.grpId),
      siteId: Number(user.siteId),
      companyCode: Number(user.companyCode),
    };

    console.log(payload, "payload");

    const results = await createTank(payload, access_token);
    if (results.success) {
      message.success(results.message || "Successfully entered!");
      clearState();
      setFieldsShow(false);
      setType("ADD");
    } else {
      message.error(results.message);
    }
  };

  const editTank = async () => {
    setType("EDIT");
    setFieldsShow(true);
    const _tanks = await getAllTankForEdit(access_token);
    if (_tanks.success) {
      setState({
        ...state,
        tanks: _tanks.data,
      });
    }
  };

  const saveEditTank = async (e) => {
    if (type === "EDIT") {
      if (!state.itemCode || !state.tankNumber) {
        return message.error(
          `Please type ${
            !state.itemCode
              ? "Item Number"
              : !state.tankNumber
              ? "Tank Number"
              : ""
          }`
        );
      }
      const data = {
        id: state.id,
        tankNumber: state.tankNumber,
        printOrder: Number(state.printOrder),
        itemCode: Number(state.itemCode),
        closed: Number(state.closed),
      };

      const results = await updateSingleTank(data, access_token);
      if (results.success) {
        message.success(results.message || "Successfully Updated!");
        clearState();
        setFieldsShow(false);
        setType("ADD");
      } else {
        message.error(results.message);
      }
    } else {
      if(!state.tankNumber) return message.error("Please Select Tank")
      modal.confirm({
        title: `Confirm`,
        content: "Are you sure you want to delete this Tank?",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: confirmDeleteNozel,
      });
    }
  };
  const confirmDeleteNozel = async () => {
    const data = {
      id: state.id,
    };
    const results = await deleteSingleTank(data, access_token);
    if (results.success) {
      message.success(results.message || "Deleted Successfully!");
      clearState();
      setFieldsShow(false);
      setType("ADD");
    } else {
      message.error(results.message);
    }
  };

  const [modal, contextHolder] = Modal.useModal();
  const deleteNozel = async () => {
    setType("DELETE");
    setFieldsShow(true);
    const _tanks = await getAllTankForEdit(access_token);
    if (_tanks.success) {
      setState({
        ...state,
        tanks: _tanks.data,
      });
    }
  };
  const confirmDelete = () => {
    modal.confirm({
      title: `Confirm`,
      content: "You want to delete Tank?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: deleteNozel,
    });
  };

  const getAllItems = async () => {
    const _item = await getAllItem(access_token);
    if (_item.success) {
      setState({
        ...state,
        items: _item.data,
      });
    }
  };
  useEffect(() => {
    getAllItems();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearStates = () => {
    clearState();
    setFieldsShow(false);
    setType("ADD");
  };
  // console.log(state, "state");
  return (
    <>
      <div className="flex  bg-black main">
        <SideBar />
        <div className="h-full  flex flex-col content-center  w-full">
          <Header />
          <div className="flex justify-center">
            <div className="meterTableMain flex flex-col justify-items-center justify-center w-1/2 ml-10 mt-5 mr-10">
              <div className="bg-blue-500 headingBox flex justify-center">
                <h1 className=" text-white">Add Tank</h1>
                {contextHolder}
              </div>
              <div className="flex flex-col p-2 content-center items-center justify-items-center justify-evenly">
                {fieldsShow && (
                  <div>
                    <div className="">
                      <label className="text-white" for="fname">
                        Tank Number:
                      </label>
                      {type === "EDIT" || type === "DELETE" ? (
                        <Select
                          showSearch
                          className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                          // className="ml-3 w-20"
                          placeholder="Select Tank"
                          optionFilterProp="children"
                          value={state.tankNumber || "Select Tank"}
                          onChange={(e) => {
                            const tankInfo = state.tanks.find(
                              (el) => el.tankNumber === e
                            );
                            console.log("e", tankInfo);
                            if(tankInfo.closed === true){
                              setState({
                                ...state,
                                tankNumber: e,
                                id: tankInfo.id,
                                itemCode: tankInfo.itemCode,
                                closed: 1,
                                printOrder: tankInfo.printOrder,
                              });
                            }
                            else{
                              setState({
                                ...state,
                                tankNumber: e,
                                id: tankInfo.id,
                                itemCode: tankInfo.itemCode,
                                closed: 0,
                                printOrder: tankInfo.printOrder,
                              });
                            }
                            
                          }}
                        >
                          {state.tanks.map((el) => (
                            <Option value={el.tankNumber}>
                              {el.tankNumber}
                            </Option>
                          ))}
                        </Select>
                      ) : (
                        <input
                          type="text"
                          name="tankNumber"
                          value={state.tankNumber}
                          onChange={onChangeText}
                          className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-white" for="fname">
                        Item :
                      </label>
                      <Select
                        showSearch
                        placeholder="Item"
                        optionFilterProp="children"
                        value={state.itemCode || "Item"}
                        onChange={(e) => {
                          console.log("e", e);

                          const _item = state.items.find(
                            (el) => el.itemCode === e
                          );
                          if (_item) {
                            setState({
                              ...state,
                              itemCode: e,
                              itemName: _item.itemName,
                            });
                          }
                        }}
                      >
                        {state.items.map((el) => (
                          <Option value={el.itemCode}>{el.itemCode}</Option>
                        ))}
                      </Select>
                      <Select
                        showSearch
                        placeholder="Item Name"
                        optionFilterProp="children"
                        value={state.itemName || "Item Name"}
                        onChange={(e) => {
                          const { itemName } = state.items.find(
                            (el) => el.itemCode === e
                          );
                          setState({
                            ...state,
                            itemCode: e,
                            itemName: itemName,
                          });
                        }}
                      >
                        {state.items.map((el) => (
                          <Option value={el.itemCode}>{el.itemName}</Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="text-white" for="fname">
                        Tank Order:
                      </label>
                      <input
                        type="text"
                        name="printOrder"
                        value={state.printOrder}
                        onChange={onChangeText}
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                      />
                    </div>
                    <div>
                    <label className="text-white" for="fname">
                        Closed:
                      </label>
                      <Select
                        showSearch
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                        placeholder="No"
                        optionFilterProp="children"
                        value={state.closed === "" ? "No" : state.closed}
                        onChange={(value) =>
                          onChangeText({ target: { name: "closed", value } })
                        }
                      >
                        <Option value={0} name="closed">
                          No
                        </Option>
                        <Option value={1} name="closed">
                          Yes
                        </Option>
                      </Select>
                    </div>
                  </div>
                )}

                <div>
                  {type === "ADD" && (
                    <button
                      onClick={addTank}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                    >
                      Add
                    </button>
                  )}

                  {type === "SAVE" && (
                    <button
                      onClick={saveTank}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                    >
                      Save
                    </button>
                  )}
                  {/* <button
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                      >
                        Add
                      </button> */}
                  {type === "ADD" && (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white ml-2 mt-3 py-1 px-4 rounded">
                      View
                    </button>
                  )}
                  {type === "ADD" && (
                    <button
                      onClick={editTank}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      Edit
                    </button>
                  )}

                  {(type === "EDIT" || type === "DELETE") && (
                    <button
                      onClick={saveEditTank}
                      className="bg-blue-500 hover:bg-blue-700 text-white ml-2 mt-3 py-1 px-4 rounded"
                    >
                      DONE
                    </button>
                  )}
                  {type === "ADD" && (
                    <button
                      onClick={confirmDelete}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      Delete
                    </button>
                  )}
                  {type !== "ADD" && (
                    <button
                      onClick={clearStates}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      Exit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tank;
