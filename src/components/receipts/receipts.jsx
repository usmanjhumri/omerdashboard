import React, { useState, useEffect } from "react";
import {
  getAllPartySearch,
  getAllGeneralLedger,
} from "../../api/endpoints/search";
import {
  getVoucher,
  getTransactionId,
  saveData,
  getData,
  updateReceipt,
  deleteSingleReceipt,
  deleteReceipt,
} from "../../api/endpoints/receipts";

import SideBar from "../sidebar/sideBar";
import Header from "../header/header";
import "./receipts.css";
import { authSelector } from "../../store/selectors/index";
import { Modal, message } from "antd";
import { Button, Dropdown, Select, Menu } from "antd";
import { useSelector } from "react-redux";
import Popup from "../modals/Popup";

const { Option } = Select;

const Receipts = () => {
  const { user, access_token } = useSelector(authSelector);

  const [voucher, setVoucher] = useState();
  const [voucherType] = useState("CV");
  const [transactionId, setTransactionId] = useState();
  const [type, setType] = useState("ADD");
  const [dateEntered, setDateEntered] = useState("");
  const [shift, setShift] = useState("");
  const [itemsQueue, setItemsQueue] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
  const [fieldsShow, setFieldsShow] = useState(false);
  const [total, setTotal] = useState();

  console.log(type, "type");

  // -------------------------- STATE ----------

  const [state, setState] = useState({
    parties: [],
    partyId: "", //ac no.
    partyName: "", // supplier name
    ledgerCodes: [],
    glCode: "",
    glDescription: "",
    description: "",
    invoiceNo: "",
    credit: "",
    cheque: "",
    transactionIdInc: "",
  });

  const clearState = () => {
    setState({
      parties: state.parties,
      partyId: "",
      partyName: "",
      ledgerCodes: state.ledgerCodes,
      glCode: "",
      glDescription: "",
      description: "",
      invoiceNo: "",
      credit: "",
      cheque: "",
    });
  };

  const clearStates = () => {
    clearState();
    setEditedItem(null);
    setFieldsShow(false);
    setItemsQueue([]);
    setShift("");
    setDateEntered("");
    setVoucher("");
    setTotal(0);
    setType("ADD");
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

  // ------------------- ADD VOUCHER ---------------

  const addVoucher = async () => {
    if (!dateEntered) return message.error("Please type date !");
    const payload = {
      enteredOn: dateEntered,
    };
    const result = await getVoucher(payload, access_token);
    const transactionId = await getTransactionId(access_token);
    console.log(result, "result");
    if (result.success) {
      setVoucher(result.data);
      setType("SAVE");
      setFieldsShow(true);
    } else {
      message.error(result.message);
    }
    if (transactionId.success) {
      setTransactionId(transactionId.data);
    }
    console.log(transactionId.data, "trannass");
  };
  // ------------------ SAVE DATA -----------------
  console.log(state, "state-=-=-=", type);

  const save = async () => {
    if (!shift) return message.error("Please type shift!");
    if (itemsQueue.length === 0) return message.error("Add minimun 1 Entry");

    const payload = itemsQueue.reduce((acc, curr) => {
      return [
        ...acc,
        {
          enteredOn: dateEntered,
          shift: Number(shift),
          partyId: Number(curr.partyId),
          description: curr.description,
          invoiceNumber: curr.invoiceNo,
          generalLedgerCode: curr.glCode,
          credit: Number(curr.credit),
          cheque: curr.cheque,
          transactionId: Number(curr.transactionIdInc),
          voucherNumber: Number(voucher),
          voucherType: voucherType,
          grpId: Number(user.grpId),
          siteId: Number(user.siteId),
          companyCode: Number(user.companyCode),
        },
      ];
    }, []);

    const result = await saveData(payload, access_token);
    if (result.success) {
      clearStates();
      message.success(result.message || "Successfully entered!");
    }
  };

  // ---------------- ALL ITEMS ----------------

  const getAllData = async () => {
    const _parties = await getAllPartySearch(access_token);
    const _ledgerCodes = await getAllGeneralLedger(access_token);
    setState({
      ...state,
      parties: _parties,
      ledgerCodes: _ledgerCodes,
    });
  };
  useEffect(() => {
    getAllData();
    if (itemsQueue.length === 0) return;

    let creditSum = itemsQueue.reduce(
      (arr, curr) => arr + Number(curr?.credit || 0),
      0
    );
    setTotal(Number(creditSum));

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsQueue]);

  console.log(total, "totttt");

  // ---------------------- ADD ITEM TO QUEUE --------------

  const addItem = () => {
    if (!(state.partyId || state.glCode) || !state.credit) {
      return message.error(
        `Please type ${
          !(state.partyId || state.glCode)
            ? "account number or GL code"
            : !state.credit
            ? "credit amount"
            : ""
        }`
      );
    } else {
      state.transactionIdInc = transactionId + 1;
      setItemsQueue([...itemsQueue, state]);
      setTransactionId(state.transactionIdInc);
      console.log(transactionId, "trid-=-=--=");
      clearState();
    }
  };

  console.log(itemsQueue, "items queue-=-=--=");
  // -------- EDIT ITEM

  const editItem = async () => {
    if (state.id) {
      await updateSingleApi();
    } else {
      itemsQueue[editedItem] = state;
      setItemsQueue([...itemsQueue]);
      setEditedItem(null);
      clearState();
    }
  };

  // -------- EDIT ITEM

  const deleteItem = (index) => {
    // const prevObject = itemsQueue[i]
    itemsQueue.splice(index, 1);
    setItemsQueue([...itemsQueue]);
    setEditedItem(null);
    console.log("deleteItem");
    clearState();
  };

  // ---------------------- EDIT API ------------------

  const [editPopup, setEditpopup] = useState(false);
  const edit = () => {
    setEditpopup(true);
  };

  const editHandler = async () => {
    if (!voucher) return message.error("Please type voucher number!");
    const results = await getData(voucher, access_token);
    if (results.success) {
      console.log(results, "ressaaaaa");
      const payload = results.data.reduce((acc, curr) => {
        return [
          ...acc,
          {
            id: curr.id,
            dateEntered: curr.enteredOn,
            shift: curr.shift,
            partyId: Number(curr.partyId),
            description: curr.description,
            invoiceNumber: curr.invoiceNo,
            glCode: Number(curr.generalLedgerCode),
            credit: Number(curr.credit),
            cheque: curr.cheqNumber,
            transactionIdInc: Number(curr.transactionId),
            ledgerCodes: state.ledgerCodes,
            parties: state.parties,
          },
        ];
      }, []);
      setItemsQueue(payload);
      setEditpopup(false);
      setType("EDIT");
    } else {
      message.error(results.message);
    }
  };

  // ---------------------- EDIT SINGLE API ------------------

  const updateSingleApi = async () => {
    const payload = {
      id: state.id,
      transactionId: state.transactionIdInc,
      partyId: Number(state.partyId),
      description: state.description,
      cheqNumber: state.cheque,
      credit: Number(state.credit),
      invoiceNumber: state.invoiceNo,
      generalLedgerCode: Number(state.glCode),
    };

    console.log(payload, "payyyyyyyyy");
    const response = await updateReceipt(payload, access_token);
    if (response.success) {
      await editHandler();
      message.success(response.message);
      clearState();
      setFieldsShow(false);
    } else {
      message.error(response.message);
    }
  };

  // ---------------- DELETE PURCHASE

  // -------- single

  const [modal, contextHolder] = Modal.useModal();
  const deleteSinglePurchase = async (transactionIdInc) => {
    console.log("deleteSingle");
    const results = await deleteSingleReceipt(transactionIdInc, access_token);
    if (results.success) {
      if (itemsQueue.length !== 1) {
        await editHandler();
      } else {
        setItemsQueue([]);
      }
      message.success("Record Deleted Successfully !");
      // clearStates()
    } else {
      message.error(results.message);
    }
  };

  const confirmDelete = (transactionIdInc) => {
    modal.confirm({
      title: `Confirm`,
      content: "Are you sure you want to delete this Record?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => deleteSinglePurchase(transactionIdInc),
    });
  };

  // -------- whole data

  const [deletePopup, setDeletepopup] = useState(false);
  const deletePurchase = () => {
    setDeletepopup(true);
  };

  const deletePurchaseHandler = async () => {
    const results = await deleteReceipt(voucher, access_token);
    if (results.success) {
      clearStates();
      message.success("Record Deleted Successfully !");
      clearStates();
      setDeletepopup(false);
    } else {
      message.error(results.message);
    }
  };
  const confirmDeleteAll = () => {
    modal.confirm({
      title: `Confirm`,
      content: "Are you sure you want to delete this Voucher?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => deletePurchaseHandler(),
    });
  };
  const menu = (index) => {
    return (
      <Menu>
        <Menu.Item key="0">
          <a
            href="/#"
            onClick={() => {
              setFieldsShow(true);
              setEditedItem(index);
              setState(itemsQueue[index]);
              console.log(itemsQueue, "edit");
            }}
          >
            Edit
          </a>
        </Menu.Item>
        {type === "SAVE" ? (
          <Menu.Item key="1">
            <a
              href="/#"
              onClick={() => {
                deleteItem(index);
              }}
            >
              {" "}
              Delete
            </a>
          </Menu.Item>
        ) : (
          <Menu.Item key="1">
            <a
              href="/#"
              onClick={() => {
                confirmDelete(itemsQueue[index].transactionIdInc);
              }}
            >
              {" "}
              Delete
            </a>
          </Menu.Item>
        )}
      </Menu>
    );
  };
  return (
    <div className="flex  bg-black main">
      <SideBar />
      <div className="h-full  flex flex-col content-center  w-full">
        <Header />
        <div className="meterTableMain ml-10 mt-5 mr-10">
          {contextHolder}
          <div className="bg-blue-500 headingBox flex justify-between">
            <h3 className=" text-white tableHeading pl-10">
              CASH RECEIPT ENTRY
            </h3>
          </div>
          <div className="bg-blue-500">
            <div className="flex content-center pt-5">
              <input
                readOnly
                value={voucher}
                className="inpTxt p-2 h-8 ml-11 mb-3 w-40"
              />
              <input
                type="date"
                value={dateEntered}
                className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                onChange={(e) => setDateEntered(e.target.value)}
              />
              <input
                type="number"
                name=""
                value={shift}
                placeholder="Shift"
                className=" text-black inpTxt p-1 h-8 ml-3 w-28"
                onChange={(e) => setShift(e.target.value)}
              />
              {fieldsShow && (
                <>
                  <Select
                    showSearch
                    className="ml-3"
                    placeholder="Credit GL Code"
                    optionFilterProp="children"
                    value={state.glCode || "Credit GL Code"}
                    onChange={(e) => {
                      const lCode = state.ledgerCodes.find(
                        (el) => el.generalLedgerCode === e
                      );
                      setState({
                        ...state,
                        glCode: e,
                        glDescription: lCode.description,
                      });
                    }}
                  >
                    {state.ledgerCodes.map((el) => (
                      <Option value={el.generalLedgerCode}>
                        {el.generalLedgerCode}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    showSearch
                    className="ml-3"
                    placeholder="GL Description"
                    optionFilterProp="children"
                    value={state.glDescription || "GL Description "}
                    onChange={(e) => {
                      const lCode = state.ledgerCodes.find(
                        (el) => el.generalLedgerCode === e
                      );
                      setState({
                        ...state,
                        glCode: e,
                        glDescription: lCode.description,
                      });
                    }}
                  >
                    {state.ledgerCodes.map((el) => (
                      <Option value={el.generalLedgerCode}>
                        {el.description}
                      </Option>
                    ))}
                  </Select>
                </>
              )}
            </div>
          </div>
          {fieldsShow && (
            <div className="">
              <div className="flex content-center flex-wrap pt-5">
                <div className="">
                  <Select
                    showSearch
                    placeholder="A/C No."
                    className="ml-3"
                    optionFilterProp="children"
                    value={state.partyId || "A/C No."}
                    onChange={(e) => {
                      console.log("e", e);

                      const _party = state.parties.find(
                        (el) => el.partyId === e
                      );
                      if (_party) {
                        setState({
                          ...state,
                          partyId: e,
                          partyName: _party.PartyName,
                          glCode: _party.chartOfAccount.generalLedgerCode,
                          glDescription: _party.chartOfAccount.description,
                        });
                      } else {
                        setState({
                          ...state,
                          partyId: e,
                          partyName: "",
                          glCode: "",
                          glDescription: "",
                        });
                      }
                    }}
                  >
                    <Option value={0}>None</Option>
                    {state.parties.map((el) => (
                      <Option value={el.partyId}>{el.partyId}</Option>
                    ))}
                  </Select>
                </div>

                <div className="">
                  <Select
                    showSearch
                    className="ml-3"
                    placeholder="Supplier Name"
                    optionFilterProp="children"
                    value={state.partyName || "Supplier Name"}
                    onChange={(e) => {
                      const { PartyName, chartOfAccount } = state.parties.find(
                        (el) => el.partyId === e
                      );
                      setState({
                        ...state,
                        partyId: e,
                        partyName: PartyName,
                        glCode: chartOfAccount.generalLedgerCode,
                        glDescription: chartOfAccount.description,
                      });
                    }}
                  >
                    {state.parties.map((el) => (
                      <Option value={el.partyId}>{el.PartyName}</Option>
                    ))}
                  </Select>
                </div>
                <input
                  type="text"
                  name="description"
                  value={state.description}
                  onChange={onChangeText}
                  placeholder="Description"
                  className=" bg-black text-white inpTxt mt-2 p-1 h-9 ml-3 w-52"
                />
                <input
                  type="text"
                  name="invoiceNo"
                  value={state.invoiceNo}
                  onChange={onChangeText}
                  placeholder="Invoice No"
                  className="bg-black text-slate-400 inpTxt mt-2 p-2 h-9 ml-3  w-20"
                />
                <input
                  type="text"
                  name="cheque"
                  value={state.cheque}
                  onChange={onChangeText}
                  placeholder="Chq/DD"
                  className="bg-black text-slate-400 inpTxt mt-2 p-2 h-9 ml-3  w-20"
                />

                <input
                  type="number"
                  name="debit"
                  value={0}
                  disabled
                  // onChange={onChangeText}
                  placeholder="Debit"
                  className="bg-black text-slate-400 inpTxt mt-2 p-2 h-9 ml-3  w-28"
                />
                <input
                  type="number"
                  name="credit"
                  value={state.credit}
                  onChange={onChangeText}
                  placeholder="Credit"
                  className="bg-black text-slate-400 inpTxt mt-2 p-2 h-9 ml-3  w-28"
                />
                {Boolean(editedItem != null) ? (
                  <button
                    onClick={editItem}
                    className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                  >
                    EDIT
                  </button>
                ) : (
                  <button
                    onClick={addItem}
                    className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                  >
                    ADD +
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="div">
            <div className="flex">
              <div className="overflow-x-auto   shadow-md sm:rounded-lg tableDiv p-5 pl-10  w-full">
                <table className=" w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="bg-blue-500 text-white uppercase dark:bg-gray-700 tableHeading  dark:text-gray-400">
                    <tr>
                      <th className="pl-3 pt-3 pb-3 fontSize" scope="col">
                        SNo.
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        GL CODE
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        GL DESCRIPTION
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Party
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Party Name
                      </th>
                      {/* <th className="pt-3 pb-3 fontSize" scope="col">
                        QTY
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        P/Rate
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Cash
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Credit
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Rebate
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        W/H
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Sales Tax
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        GL
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        GL Desc.
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Freight
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Lorry Tip
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Depo Exp.
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        CMP
                      </th> */}
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        DESCRIPTION
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Invoice
                      </th>
                      {/* <th className="pt-3 pb-3 fontSize" scope="col">
                        Invoice Date
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Lorry No.
                      </th> */}
                      {/* <th className="pt-3 pb-3 fontSize" scope="col">
                        Short Dip
                      </th>  <th className="pt-3 pb-3 fontSize" scope="col">
                        Short Qty
                      </th>   */}
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Cheque/DD
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Credit
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tableBody">
                    {itemsQueue.map((ele, i) => {
                      return (
                        <tr key={i} className="tbodyData text-white">
                          <td className="pl-3 pt-3 pb-3">{i + 1}</td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.glCode}</p>
                          </td>{" "}
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.glDescription}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.partyId}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.partyName}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.description}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.invoiceNo}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.cheque}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.credit}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <Dropdown overlay={menu(i)} placement="bottomLeft">
                              <Button>Action</Button>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex justify-end">
                  <input
                    type="text"
                    readOnly
                    placeholder=""
                    name=""
                    id=""
                    value={total}
                    className="mt-2 pl-10 pt-1 pb-1 w-32 bg-black text-white outline-none"
                  />
                </div>
                <div className="flex justify-evenly">
                  <div>
                    {type === "ADD" && (
                      <button
                        onClick={addVoucher}
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                      >
                        Add
                      </button>
                    )}

                    {type === "SAVE" && (
                      <button
                        onClick={save}
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                      >
                        Save
                      </button>
                    )}

                    {type === "ADD" && (
                      <button
                        onClick={edit}
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => deletePurchase()}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                      disabled={type !== "ADD"}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        clearStates();
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      {type === "EDIT" ? "Done" : "Exit"}
                    </button>
                  </div>
                  <div className="flex content-end mt-3 bg-white justify-end"></div>

                  <div>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded">
                      <img src={`./img/first.png`} alt="" />
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded">
                      <img src={`./img/previous.png`} alt="" />
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded">
                      <img src={`./img/next.png`} alt="" />
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded">
                      <img src={`./img/latest.png`} alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popup popup={editPopup} handlePopup={setEditpopup} onOk={editHandler}>
        <div>
          <h2>Please type voucher number</h2>
          <input
            style={{
              border: "1px solid",
            }}
            autoFocus
            type="number"
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
          />
        </div>
      </Popup>

      <Popup
        popup={deletePopup}
        handlePopup={setDeletepopup}
        onOk={confirmDeleteAll}
      >
        <div>
          <h2>Please type voucher number for delete record</h2>
          <input
            style={{
              border: "1px solid",
            }}
            autoFocus
            type="number"
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
          />
        </div>
      </Popup>
    </div>
  );
};

export default Receipts;
