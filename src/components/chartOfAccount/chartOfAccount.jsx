import React, { useState } from "react";
import {
  createAccount,
  getAllAccountForEdit,
  updateSingleAccount,
  deleteSingleAccount,
} from "../../api/endpoints/chartOfAccount";
import { authSelector } from "../../store/selectors/index";
import { useSelector } from "react-redux";
import { Modal, message, Select } from "antd";
import SideBar from "../sidebar/sideBar";
import Header from "../header/header";
const { Option } = Select;

const ChartOfAccount = () => {
  const { user, access_token } = useSelector(authSelector);
  const [fieldsShow, setFieldsShow] = useState(false);
  const [type, setType] = useState("ADD");
  const [state, setState] = useState({
    generalLedgerCodes: [],
    generalLedgerCode: "",
    description: "",
    closed: "",
  });

  const clearState = () => {
    setState({
      id: "",
      generalLedgerCode: "",
      generalLedgerCodes: state.generalLedgerCodes,
      description: "",
      closed: "",
    });
  };

  //   console.log(state, "Vall");

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
  //   console.log(state.generalLedgerCode.length,"leng")
  const saveTank = async (e) => {
    if (state.generalLedgerCode.length < 9) {
      return message.error(
        "Account Number must contain exactly 9 numeric digits."
      );
    }
    if (!state.generalLedgerCode || !state.description) {
      return message.error(
        `Please type ${
          !state.generalLedgerCode
            ? "Account Number"
            : !state.description
            ? "Description"
            : ""
        }`
      );
    }
    const payload = {
      generalLedgerCode: state.generalLedgerCode,
      description: state.description,
      closed: Number(state.closed),
      grpId: Number(user.grpId),
      siteId: Number(user.siteId),
      companyCode: Number(user.companyCode),
    };

    console.log(payload, "payload");

    const results = await createAccount(payload, access_token);
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
    const _ledgerAccounts = await getAllAccountForEdit(access_token);
    if (_ledgerAccounts.success) {
      setState({
        ...state,
        generalLedgerCodes: _ledgerAccounts.data,
      });
    }
  };

  const saveEditTank = async (e) => {
    if (type === "EDIT") {
      if (state.generalLedgerCode.length < 9) {
        return message.error(
          "Account Number must contain exactly 9 numeric digits."
        );
      }
      if (!state.generalLedgerCode || !state.description) {
        return message.error(
          `Please type ${
            !state.generalLedgerCode
              ? "Account Number"
              : !state.description
              ? "Description"
              : ""
          }`
        );
      }
      const data = {
        // id: state.id,
        generalLedgerCode: state.generalLedgerCode,
        description: state.description,
        closed: Number(state.closed),
      };
      console.log(data, "edite data");
      const results = await updateSingleAccount(data, access_token);
      if (results.success) {
        message.success(results.message || "Successfully Updated!");
        clearState();
        setFieldsShow(false);
        setType("ADD");
      } else {
        message.error(results.message);
      }
    } else {
      if (!state.generalLedgerCode) return message.error("Please Select Account");
      modal.confirm({
        title: `Confirm`,
        content: "Are you sure you want to delete this Account?",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: confirmDeleteNozel,
      });
    }
  };
  const confirmDeleteNozel = async () => {
    const data = {
      generalLedgerCode: state.generalLedgerCode,
    };
    const results = await deleteSingleAccount(data, access_token);
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
    const _ledgerAccounts = await getAllAccountForEdit(access_token);
    if (_ledgerAccounts.success) {
      setState({
        ...state,
        generalLedgerCodes: _ledgerAccounts.data,
      });
    }
  };
  const confirmDelete = () => {
    modal.confirm({
      title: `Confirm`,
      content: "You want to delete Account?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: deleteNozel,
    });
  };

  const clearStates = () => {
    clearState();
    setFieldsShow(false);
    setType("ADD");
  };
  console.log(state, "state");
  return (
    <>
      <div className="flex  bg-black main">
        <SideBar />
        <div className="h-full  flex flex-col content-center  w-full">
          <Header />
          <div className="flex justify-center">
            <div className="meterTableMain flex flex-col justify-items-center justify-center w-1/2 ml-10 mt-5 mr-10">
              <div className="bg-blue-500 headingBox flex justify-center">
                <h1 className=" text-white">Add Chart of Account</h1>
                {contextHolder}
              </div>
              <div className="flex flex-col p-2 content-center items-center justify-items-center justify-evenly">
                {fieldsShow && (
                  <div>
                    <div className="">
                      <label className="text-white" for="fname">
                        Account Number:
                      </label>
                      {type === "EDIT" || type === "DELETE" ? (
                        <>
                          <Select
                            showSearch
                            placeholder="Account Number"
                            optionFilterProp="children"
                            value={state.generalLedgerCode || "Account Number"}
                            onChange={(e) => {
                              const _accountInfo =
                                state.generalLedgerCodes.find(
                                  (el) => el.generalLedgerCode === e
                                );
                              console.log("e", _accountInfo);

                              if (_accountInfo.closed === false) {
                                setState({
                                  ...state,
                                  generalLedgerCode: e,
                                  description: _accountInfo.description,
                                  closed: 0,
                                });
                              } else {
                                setState({
                                  ...state,
                                  generalLedgerCode: e,
                                  description: _accountInfo.description,
                                  closed: 1,
                                });
                              }
                            }}
                          >
                            {state.generalLedgerCodes.map((el) => (
                              <Option value={el.generalLedgerCode}>
                                {el.generalLedgerCode}
                              </Option>
                            ))}
                          </Select>
                          <Select
                            showSearch
                            placeholder="Account Description"
                            optionFilterProp="children"
                            value={state.description || "Account Description"}
                            onChange={(e) => {
                              const _accountInfo =
                                state.generalLedgerCodes.find(
                                  (el) => el.generalLedgerCode === e
                                );
                              if (_accountInfo.closed === false) {
                                setState({
                                  ...state,
                                  generalLedgerCode: e,
                                  description: _accountInfo.description,
                                  closed: 0,
                                });
                              } else {
                                setState({
                                  ...state,
                                  generalLedgerCode: e,
                                  description: _accountInfo.description,
                                  closed: 1,
                                });
                              }
                            }}
                          >
                            {state.generalLedgerCodes.map((el) => (
                              <Option value={el.generalLedgerCode}>
                                {el.description}
                              </Option>
                            ))}
                          </Select>
                        </>
                      ) : (
                        <input
                          type="number"
                          name="generalLedgerCode"
                          value={state.generalLedgerCode}
                          onChange={(e) => {
                            const input = e.target.value.slice(0, 9);
                            onChangeText({
                              target: {
                                name: "generalLedgerCode",
                                value: input,
                              },
                            });
                          }}
                          className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-white" for="fname">
                        Description :
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={state.description}
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

export default ChartOfAccount;
