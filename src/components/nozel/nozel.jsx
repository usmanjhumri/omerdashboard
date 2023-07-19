import React, { useEffect, useState } from "react";
import {
  createNozel,
  deleteSingleNozel,
  getAllNozel,
  updateSingleNozel,
} from "../../api/endpoints/nozel.js";
import { authSelector } from "../../store/selectors/index";
import { useSelector } from "react-redux";
import { Modal, message, Select } from "antd";
import SideBar from "../sidebar/sideBar";
import Header from "../header/header";
import { getAllTank } from "../../api/endpoints/tank";
const { Option } = Select;

const Nozel = () => {
  const { user, access_token } = useSelector(authSelector);
  const [fieldsShow, setFieldsShow] = useState(false);
  const [type, setType] = useState("ADD");
  const [state, setState] = useState({
    id: "",
    nozelNumber: "",
    tanks: [],
    nozels: [],
    tankNumber: "",
    nozelOrder: "",
    closed: "",
  });

  const clearState = () => {
    setState({
      nozelNumber: "",
      nozelOrder: "",
      closed: "",
      tanks: state.tanks,
      nozels: state.nozels,
      tankNumber: "",
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
  const addNozel = async () => {
    setType("SAVE");
    setFieldsShow(true);
  };
  const saveNozel = async (e) => {
    if (!state.nozelNumber || !state.tankNumber) {
      return message.error(
        `Please type ${
          !state.nozelNumber
            ? "Nozel Number"
            : !state.tankNumber
            ? "Tank Number"
            : ""
        }`
      );
    }
    const payload = {
      nozelNumber: state.nozelNumber,
      tankNumber: state.tankNumber,
      nozelOrder: Number(state.nozelOrder),
      closed: Number(state.closed),
      grpId: Number(user.grpId),
      siteId: Number(user.siteId),
      companyCode: Number(user.companyCode),
    };

    console.log(payload, "payload");

    const results = await createNozel(payload, access_token);
    if (results.success) {
      message.success(results.message || "Successfully entered!");
      clearState();
      setFieldsShow(false);
      setType("ADD");
    } else {
      message.error(results.message);
    }
  };

  const editNozel = async () => {
    setType("EDIT");
    setFieldsShow(true);
    const _nozels = await getAllNozel(access_token);
    if (_nozels.success) {
      setState({
        ...state,
        nozels: _nozels.data,
      });
    }
  };

  const saveEditNozel = async (e) => {
    if (type === "EDIT") {
      if (!state.nozelNumber || !state.tankNumber) {
        return message.error(
          `Please type ${
            !state.nozelNumber
              ? "Nozel Number"
              : !state.tankNumber
              ? "Tank Number"
              : ""
          }`
        );
      }
      const data = {
        id: state.id,
        nozelNumber: state.nozelNumber,
        tankNumber: state.tankNumber,
        nozelOrder: Number(state.nozelOrder),
        closed: Number(state.closed),
      };

      const results = await updateSingleNozel(data, access_token);
      if (results.success) {
        message.success(results.message || "Successfully Updated!");
        clearState();
        setFieldsShow(false);
        setType("ADD");
      } else {
        message.error(results.message);
      }
    } else {
      if(!state.nozelNumber) return message.error("Please Select Nozel")
      modal.confirm({
        title: `Confirm`,
        content: "Are you sure you want to delete this Nozel?",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: confirmDeleteNozel,
      });
    }
  };
  const confirmDeleteNozel = async () => {
    const data = {
      id: state.id,
      nozelNumber: state.nozelNumber,
      tankNumber: state.tankNumber,
      nozelOrder: Number(state.nozelOrder),
      closed: Number(state.closed),
    };
    const results = await deleteSingleNozel(data, access_token);
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
    const _nozels = await getAllNozel(access_token);
    if (_nozels.success) {
      setState({
        ...state,
        nozels: _nozels.data,
      });
    }
  };
  const confirmDelete = () => {
    modal.confirm({
      title: `Confirm`,
      content: "You want to delete Nozel?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: deleteNozel,
    });
  };

  const getAllTanks = async () => {
    const _tanks = await getAllTank(access_token);
    if (_tanks.success) {
      setState({
        ...state,
        tanks: _tanks.data,
      });
    }
  };
  useEffect(() => {
    getAllTanks();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearStates = () => {
    clearState();
    setFieldsShow(false);
    setType("ADD");
  };
  return (
    <>
      <div className="flex  bg-black main">
        <SideBar />
        <div className="h-full  flex flex-col content-center  w-full">
          <Header />
          <div className="flex justify-center">
            <div className="meterTableMain flex flex-col justify-items-center justify-center w-1/2 ml-10 mt-5 mr-10">
              <div className="bg-blue-500 headingBox flex justify-center">
                <h1 className=" text-white">Add Nozel</h1>
                {contextHolder}
              </div>
              <div className="flex flex-col p-2 content-center items-center justify-items-center justify-evenly">
                {fieldsShow && (
                  <div>
                    <div className="">
                      <label className="text-white" for="fname">
                        Nozel Number:
                      </label>
                      {type === "EDIT" || type === "DELETE" ? (
                        <Select
                          showSearch
                          className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                          // className="ml-3 w-20"
                          placeholder="Nozel"
                          optionFilterProp="children"
                          value={state.nozelNumber || "Nozel"}
                          onChange={(e) => {
                            const nozelInfo = state.nozels.find(
                              (el) => el.nozelNumber === e
                            );
                            console.log(nozelInfo,"e")
                            setState({
                              ...state,
                              nozelNumber: e,
                              id: nozelInfo.id,
                              tankNumber: nozelInfo.tank.tankNumber,
                              closed: nozelInfo.Closed,
                              nozelOrder: nozelInfo.nozelOrder,
                            });
                          }}
                        >
                          {state.nozels.map((el) => (
                            <Option value={el.nozelNumber}>
                              {el.nozelNumber}
                            </Option>
                          ))}
                        </Select>
                      ) : (
                        <input
                          type="text"
                          name="nozelNumber"
                          value={state.nozelNumber}
                          onChange={onChangeText}
                          className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-white" for="fname">
                        Tank Number:
                      </label>
                      <Select
                        showSearch
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                        // className="ml-3 w-20"
                        placeholder="Tank"
                        optionFilterProp="children"
                        value={state.tankNumber || "Tank"}
                        onChange={(e) => {
                          state.tanks.find((el) => el.tankNumber === e);
                          setState({
                            ...state,
                            tankNumber: e,
                          });
                        }}
                      >
                        {state.tanks.map((el) => (
                          <Option value={el.tankNumber}>{el.tankNumber}</Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label className="text-white" for="fname">
                        Nozel Order:
                      </label>
                      <input
                        type="text"
                        name="nozelOrder"
                        value={state.nozelOrder}
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
                      onClick={addNozel}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                    >
                      Add
                    </button>
                  )}

                  {type === "SAVE" && (
                    <button
                      onClick={saveNozel}
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
                      onClick={editNozel}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      Edit
                    </button>
                  )}

                  {(type === "EDIT" || type === "DELETE") && (
                    <button
                      onClick={saveEditNozel}
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

export default Nozel;
