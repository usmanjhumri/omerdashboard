import React, { useState, useEffect } from "react";
import {
  getAllItemsSearch,
  getAllPartySearch,
  getAllGeneralLedger,
} from "../../api/endpoints/search";
import { getTankById } from "../../api/endpoints/tank";
import {
  getVoucher, saveData, getData, updatePurchase, deleteSingleInvoivce, deleteInvoivce,
} from "../../api/endpoints/purchase";
import SideBar from "../sidebar/sideBar";
import Header from "../header/header";
import "./purchase.css";
import { authSelector } from "../../store/selectors/index";
import { Modal, message } from "antd";
import { Button, Dropdown, Select, Menu } from "antd";
import { useSelector } from "react-redux";
import Popup from "../modals/Popup";
const { Option } = Select;
const Purchase = () => {
  const { user, access_token } = useSelector(authSelector);

  const [voucher, setVoucher] = useState();
  const [type, setType] = useState("ADD");
  const [dateEntered, setDateEntered] = useState("");
  const [shift, setShift] = useState("");
  const [itemsQueue, setItemsQueue] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
  const [fieldsShow, setFieldsShow] = useState(false);

  // -------------------------- STATE ----------

  const [state, setState] = useState({
    items: [],
    code: "",
    name: "",
    parties: [],
    partyId: "", //ac no.
    partyName: "", // supplier name
    ledgerCodes: [],
    glCode: "",
    glDescription: "",
    quantity: "",
    purchaseRate: "",
    cashAmount: "",
    creditAmount: "",
    rebate: "",
    withHoldingTax: "",
    salesTax: "",
    freight: "",
    lorryTip: "",
    depoExp: "",
    cmpRate: "",
    invoiceNo: "",
    invoiceDate: "",
    lorryNo: "",
    shortDip: "",
    shortQty: "",
    cheque: "",
    tanks: [],
    tank: "",
  });

  const clearState = () => {
    setState({
      items: state.items,
      code: "",
      name: "",
      parties: state.parties,
      partyId: "",
      partyName: "",
      ledgerCodes: state.ledgerCodes,
      glCode: "",
      glDescription: "",
      quantity: "",
      purchaseRate: "",
      cashAmount: "",
      creditAmount: "",
      rebate: "",
      withHoldingTax: "",
      salesTax: "",
      freight: "",
      lorryTip: "",
      depoExp: "",
      cmpRate: "",
      invoiceNo: "",
      invoiceDate: "",
      lorryNo: "",
      shortDip: "",
      shortQty: "",
      cheque: "",
      tanks: state.tanks,
      tank: "",
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
    console.log(result, "result");
    if (result.success) {
      setVoucher(result.data);
      setType("SAVE");
      setFieldsShow(true);
    } else {
      message.error(result.message);
    }
  };

  // ------------------ SAVE DATA -----------------
  console.log(state, "state-=-=-=", type);

  const save = async () => {
    if (!shift) return message.error("Please type shift!");
    if (itemsQueue.length === 0) return message.error("Add minimun 1 item");

    const payload = itemsQueue.reduce((acc, curr) => {
      return [
        ...acc,
        {
          enteredOn: dateEntered,
          shift: Number(shift),
          partyId: Number(curr.partyId),
          // refrenceNumber: curr.invoiceNo,
          itemCode: curr.code,
          quantity: Number(curr.quantity),
          purchaseRate: Number(curr.purchaseRate),
          cashAmount: Number(curr.cashAmount),
          withHoldingTax: Number(curr.withHoldingTax),
          description: "",
          creditAmount: Number(curr.creditAmount),
          tankNumber: curr.tank,
          invoiceNumber: curr.invoiceNo,
          invoiceDate: curr.invoiceDate,
          generalLedgerCode: curr.glCode,
          saleRate: Number(curr.saleRate),
          saleTax: Number(curr.salesTax),
          gst: Number(curr.rebate),
          shortDip: Number(curr.shortDip),
          shortQuantity: Number(curr.shortQty),
          lorryNumber: curr.lorryNo,
          frieght: Number(curr.freight),
          depoExpense: Number(curr.depoExp),
          purchaseVoucherNo: Number(voucher),
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
    const _items = await getAllItemsSearch(access_token);
    const _parties = await getAllPartySearch(access_token);
    const _ledgerCodes = await getAllGeneralLedger(access_token);
    setState({
      ...state,
      items: _items,
      parties: _parties,
      ledgerCodes: _ledgerCodes,
    });
  };
  useEffect(() => {
    getAllData();

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTankByCode = async () => {
    const data = await getTankById(state.code, access_token);
    if (data.success) {
      setState({
        ...state,
        tanks: data.data,
        tank: data.data[0].tankNumber,
      });
    }
  };

  useEffect(() => {
    if (state.code) {
      getTankByCode();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.code]);

  // ---------------------- ADD ITEM TO QUEUE --------------

  const addItem = () => {
    if (
      !state.code ||
      !(state.partyId || state.glCode) ||
      !state.quantity ||
      !(state.cashAmount || state.creditAmount)
    ) {
      return message.error(
        `Please type ${!state.code
          ? "item"
          : !(state.partyId || state.glCode)
            ? "account number or GL code"
            : !state.quantity
              ? "quantity"
              : !(state.cashAmount || state.creditAmount)
                ? "cash amount/credit amount"
                : ""
        }`
      );
    } else {
      setItemsQueue([...itemsQueue, state]);
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
      const payload = results.data.reduce((acc, curr) => {
        return [
          ...acc,
          {
            id: curr.id,
            dateEntered: curr.enteredOn,
            shift: curr.shift,
            partyId: Number(curr.partyId),
            // refrenceNumber: curr.invoiceNo,
            code: curr.itemCode,
            quantity: Number(curr.quantity),
            purchaseRate: Number(curr.purchaseRate),
            cashAmount: Number(curr.cashAmount),
            withHoldingTax: Number(curr.withHoldingTax),
            description: "",
            creditAmount: Number(curr.creditAmount),
            tank: curr.tankNumber,
            invoiceNo: curr.invoiceNumber,
            invoiceDate: curr.invoiceDate,
            glCode: curr.generalLedgerCode,
            saleRate: Number(curr.saleRate),
            salesTax: Number(curr.saleTax),
            rebate: Number(curr.gst),
            shortDip: Number(curr.shortDip),
            shortQty: Number(curr.shortQuantity),
            lorryNo: curr.lorryNumber,
            freight: Number(curr.frieght),
            depoExp: Number(curr.depoExpense),
            tanks: state.tanks,
            ledgerCodes: state.ledgerCodes,
            parties: state.parties,
            items: state.items,
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
      partyId: Number(state.partyId),
      // refrenceNumber: state.invoiceNo,
      itemCode: state.code,
      quantity: Number(state.quantity),
      purchaseRate: Number(state.purchaseRate),
      cashAmount: Number(state.cashAmount),
      withHoldingTax: Number(state.withHoldingTax),
      description: "",
      creditAmount: Number(state.creditAmount),
      tankNumber: state.tank,
      invoiceNumber: state.invoiceNo,
      invoiceDate: state.invoiceDate,
      generalLedgerCode: state.glCode,
      saleRate: Number(state.saleRate),
      saleTax: Number(state.salesTax),
      gst: Number(state.rebate),
      shortDip: Number(state.shortDip),
      shortQuantity: Number(state.shortQty),
      lorryNumber: state.lorryNo,
      frieght: Number(state.freight),
      depoExpense: Number(state.depoExp),
    };

    const response = await updatePurchase(payload, access_token);
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
  const deleteSinglePurchase = async (id) => {
    const results = await deleteSingleInvoivce(id, access_token);
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

  const confirmDelete = (id) => {
    modal.confirm({
      title: `Confirm`,
      content: "Are you sure you want to delete this invoice?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => deleteSinglePurchase(id),
    });
  };

  // -------- whole data

  const [deletePopup, setDeletepopup] = useState(false);
  const deletePurchase = () => {
    setDeletepopup(true);
  };

  const deletePurchaseHandler = async () => {
    const results = await deleteInvoivce(voucher, access_token);
    if (results.success) {
      clearStates();
      message.success("Record Deleted Successfully !");
      clearStates();
      setDeletepopup(false);
    } else {
      message.error(results.message);
    }
  };
  const menu = (index) => {
    return (
      <Menu>
        <Menu.Item key="0">
          <button
            onClick={() => {
              setFieldsShow(true);
              setEditedItem(index);
              setState(itemsQueue[index]);
            }}
          >
            Edit
          </button>
        </Menu.Item>
        <Menu.Item key="1">
          <button
            onClick={() => {
              itemsQueue[index].id
                ? confirmDelete(itemsQueue[index].id)
                : deleteItem(index);
            }}
          >
            {" "}
            Delete
          </button>
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <div className="flex  bg-black main">
      {/* <SideBar /> */}
      <div className="h-full  flex flex-col content-center  w-80">
        {/* <Header /> */}
        <div className="meterTableMain ml-10 mt-5 mr-10">
          {contextHolder}
          <div className="bg-blue-500 headingBox pt-2 flex justify-between">
            <h3 className=" text-white tableHeading pl-10">
              STOCK ITEM PURCHASE
            </h3>
            <input
              readOnly
              placeholder="Voucher no#"
              value={voucher}
              className="custom-select p-3  mr-10 mt-2 w-40"
            />
          </div>
          <div className="bg-blue-500 pb-3">
            <div className="flex content-center pt-5">
              <input
                type="date"
                value={dateEntered}
                className="custom-select ml-10 p-3"
                onChange={(e) => setDateEntered(e.target.value)}
              />
              <input
                type="number"
                name=""
                value={shift}
                placeholder="Shift"
                className=" custom-select ml-10 p-3"
                onChange={(e) => setShift(e.target.value)}
              />
              {fieldsShow && (
                <>
                  <Select
                    showSearch
                    className="custom-select ml-10 p-1"
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
                    className="custom-select ml-10 p-1"
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

                  <Select
                    showSearch
                    placeholder="A/C No."
                    className="custom-select ml-10 mr-10 p-1"
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
                </>
              )}
            </div>
          </div>
          {fieldsShow && (
            <div className="">
              <div className="flex content-center flex-wrap pt-5">
                <Select
                  showSearch
                  placeholder="Select item"
                  className="bg-black text-white  inpTxt  p-1 h-9 ml-10 w-20"
                  optionFilterProp="children"
                  value={state.code || "Item"}
                  onChange={(e) => {
                    const { itemName: productName } = state.items.find(
                      (el) => el.itemCode === e
                    );
                    setState({ ...state, code: e, name: productName });
                  }}
                >
                  {state.items.map((el) => (
                    <Option value={el.itemCode}>{el.itemCode}</Option>
                  ))}
                </Select>
                <Select
                  showSearch
                  placeholder="Select Product Name"
                  optionFilterProp="children"
                  className="bg-black text-white  inpTxt  p-1 h-9 ml-3 w-28"
                  value={state.name || "Prodct Name"}
                  onChange={(e) => {
                    const { itemName: productName } = state.items.find(
                      (el) => el.itemCode === e
                    );
                    setState({ ...state, code: e, name: productName });
                  }}
                >
                  {state.items.map((el) => (
                    <Option value={el.itemCode}>{el.itemName}</Option>
                  ))}
                </Select>

                <div className="">
                  <Select
                    showSearch
                    placeholder="Supplier Name"
                    className=" bg-black text-white  inpTxt  p-1 h-9 ml-3 w-28"
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
                  type="number"
                  name="quantity"
                  id=""
                  value={state.quantity}
                  // onChange={onChangeText}
                  onChange={(e) => {
                    if (state.purchaseRate) {
                      setState({
                        ...state,
                        creditAmount: e.target.value * state.purchaseRate,
                        quantity: e.target.value,
                      });
                    } else {
                      setState({ ...state, quantity: e.target.value });
                    }
                  }}
                  placeholder="Quantity"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-20"
                />
                <input
                  type="number"
                  name="purchaseRate"
                  id=""
                  value={state.purchaseRate}
                  // onChange={onChangeText}
                  onChange={(e) => {
                    if (state.quantity) {
                      setState({
                        ...state,
                        creditAmount: e.target.value * state.quantity,
                        purchaseRate: e.target.value,
                      });
                    } else {
                      setState({ ...state, purchaseRate: e.target.value });
                    }
                  }}
                  placeholder="P/Rate"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-16"
                />
                <input
                  type="number"
                  name="cashAmount"
                  id=""
                  value={state.cashAmount}
                  disabled={Boolean(state.creditAmount)}
                  // onChange={onChangeText}
                  onChange={(e) => {
                    if (state.quantity) {
                      setState({
                        ...state,
                        purchaseRate: e.target.value / state.quantity,
                        cashAmount: e.target.value,
                      });
                    } else {
                      setState({ ...state, cashAmount: e.target.value });
                    }
                  }}
                  placeholder="Cash Amount"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-28"
                />
                <input
                  type="number"
                  name="creditAmount"
                  id=""
                  disabled={Boolean(state.cashAmount)}
                  value={state.creditAmount}
                  onChange={(e) => {
                    if (state.quantity) {
                      setState({
                        ...state,
                        purchaseRate: e.target.value / state.quantity,
                        creditAmount: e.target.value,
                      });
                    } else {
                      setState({ ...state, creditAmount: e.target.value });
                    }
                  }}
                  placeholder="Credit Amount"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-28"
                />
                <input
                  type="text"
                  id=""
                  placeholder="Rebate"
                  name="rebate"
                  value={state.rebate}
                  onChange={onChangeText}
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-16"
                />
                <input
                  type="number"
                  id=""
                  name="withHoldingTax"
                  value={state.withHoldingTax}
                  onChange={onChangeText}
                  placeholder="W/H Tax"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-16"
                />
                <input
                  type="number"
                  name="salesTax"
                  value={state.salesTax}
                  onChange={onChangeText}
                  id=""
                  placeholder="Salex Tax"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-16"
                />
                <input
                  type="number"
                  name="freight"
                  value={state.freight}
                  onChange={onChangeText}
                  placeholder="Frieght/L"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-20"
                />

                <div className="">
                  <div className="flex content-center flex-wrap justify-center pt-5">
                    <input
                      type="number"
                      name="lorryTip"
                      value={state.lorryTip}
                      onChange={onChangeText}
                      placeholder="Lorry Tip"
                      className=" bg-black text-white inpTxt mt-2 p-1 h-9 ml-10 w-20"
                    />
                    <input
                      type="number"
                      name="depoExp"
                      value={state.depoExp}
                      onChange={onChangeText}
                      placeholder="Depo Exp."
                      className="bg-black text-slate-400 inpTxt mt-2 p-2 h-9 ml-3  w-20"
                    />
                    <input
                      type="text"
                      name="cmpRate"
                      value={state.cmpRate}
                      onChange={onChangeText}
                      placeholder="CMP Rate"
                      className=" bg-black text-white inpTxt mt-2 p-1 h-9 ml-3 w-20"
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
                      type="date"
                      name="invoiceDate"
                      value={state.invoiceDate}
                      onChange={onChangeText}
                      className="inpTxt mt-2 dateInp bg-black text-slate-400  p-2 h-9 ml-3 w-28"
                    />
                    <input
                      type="text"
                      name="lorryNo"
                      value={state.lorryNo}
                      onChange={onChangeText}
                      placeholder="Lorry No"
                      className="bg-black text-slate-400 inpTxt mt-2 p-2 h-9 ml-3  w-20"
                    />
                    <input
                      type="number"
                      name="shortDip"
                      value={state.shortDip}
                      onChange={onChangeText}
                      placeholder="Short Dip"
                      className="bg-black text-slate-400 inpTxt mt-2 p-2 h-9 ml-3  w-20"
                    />
                    <input
                      type="number"
                      name="shortQty"
                      value={state.shortQty}
                      onChange={onChangeText}
                      placeholder="Short Qty"
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
                    <Select
                      showSearch
                      placeholder="Tank"
                      optionFilterProp="children"
                      className="bg-black text-white  inpTxt  mt-2 p-1 h-9 ml-3 w-20"
                      value={state.tank || "Tank"}
                      onChange={(e) => {
                        setState({ ...state, tank: e });
                      }}
                    >
                      {state.tanks.map((el) => (
                        <Option value={el.tankNumber}>{el.tankNumber}</Option>
                      ))}
                    </Select>
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
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-2 ml-3 py-1 px-4 rounded"
                      >
                        ADD +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div class="overflow-x-auto m-10 mr-10 mt-4">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    SNo.
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    ITEM ID
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    ITEM
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Party
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Party Name
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    QTY
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    P/Rate
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Cash
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Credit
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Rebate
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    W/H
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Sales Tax
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    GL
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    GL Desc.
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Freight
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Lorry Tip
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Depo Exp.
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    CMP
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Invoice
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Invoice Date
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Lorry No.
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Short Dip
                  </th>{" "}
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Short Qty
                  </th>{" "}
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Cheque/DD
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    Tank
                  </th>
                  <th
                    className="px-6 fs-15 py-3 table-cell  bg-blue-500  text-left text-xs font-medium  uppercase tracking-wider"
                    scope="col"
                  >
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody className="tableBody bg-white divide-y divide-gray-200">
                {itemsQueue.map((ele, i) => {
                  return (
                    <tr key={i} className="tbodyData">
                      <td className="pl-3 pt-3 pb-3 table-cell ">{i + 1}</td>
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.code}</p>
                      </td>
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.name}</p>
                      </td>
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.partyId}</p>
                      </td>
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.partyName}</p>
                      </td>
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.quantity}</p>
                      </td>
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.purchaseRate}</p>
                      </td>
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.cashAmount}</p>
                      </td>
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.creditAmount}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.rebate}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.withHoldingTax}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.salesTax}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.glCode}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.glDescription}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.freight}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.lorryTip}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.depoExp}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.cmpRate}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.invoiceNo}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.invoiceDate}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.lorryNo}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.shortDip}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.shortQty}</p>
                      </td>{" "}
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.cheque}</p>
                      </td>
                      <td className="pt-3 pb-3 table-cell ">
                        <p className="fontSize">{ele.tank}</p>
                      </td>
                      <td className="pt-3 pb-3 table-cell ">
                        <Dropdown overlay={menu(i)} placement="bottomLeft">
                          <Button>Action</Button>
                        </Dropdown>
                        {/* <button style={{
                                border: "1px solid",
                                padding: '5pxs'
                              }} onClick={() => null}>Edit</button>
                              <button style={{
                                border: "1px solid",
                                padding: '5pxs'
                              }} onClick={() => null}>Delete</button> */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="div">
            <div className="flex">
              <div className="overflow-x-auto   shadow-md sm:rounded-lg tableDiv p-5 pl-10  w-full">
                {/* <input
                  type="text"
                  readOnly
                  placeholder=""
                  name=""
                  id=""
                  className="mt-2 p-1 w-full bg-black text-slate-400 outline-none"
                /> */}
                <div className="flex justify-between">
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
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3  py-1 px-6 fs-15 rounded"
                      >
                        Save
                      </button>
                    )}

                    {type === "ADD" && (
                      <button
                        onClick={edit}
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-6 fs-15 rounded"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => deletePurchase()}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-6 fs-15 rounded"
                      disabled={type !== "ADD"}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        clearStates();
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-6 fs-15 rounded"
                    >
                      {type === "EDIT" ? "Done" : "Exit"}
                    </button>
                  </div>
                  <div className="flex content-end mt-3 bg-white justify-end"></div>

                  <div>
                    <button className="bg-black hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded">
                      <img src={`./img/first.png`} alt="" />
                    </button>
                    <button className="bg-black hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded">
                      <img src={`./img/previous.png`} alt="" />
                    </button>
                    <button className="bg-black hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded">
                      <img src={`./img/next.png`} alt="" />
                    </button>
                    <button className="bg-black hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded">
                      <img src={`./img/latest.png`} alt="" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between pt-5 pb-5">
                  <div>
                    <div class="flex items-center">
                      <span class="mr-2 text-white">Total Amount</span>
                      <input
                        type="text"
                        class="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-28"
                      />
                    </div>
                  </div>
                  <div className="">
                    <div class="flex items-center">
                      <span class="mr-2 text-white">Total W/O Taxes</span>
                      <input
                        type="text"
                        class="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-28"
                      />
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center">
                      <span class="mr-2 text-white">Total Incl Taxes</span>
                      <input
                        type="text"
                        class="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-28"
                      />
                    </div>
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
        onOk={deletePurchaseHandler}
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

export default Purchase;
