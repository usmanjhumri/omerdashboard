import React, { useState, useEffect } from "react";
import { getAllItemsSearch } from "../../api/endpoints/search";
import {
  getVoucher,
  saveData,
  getData,
  descSale,
  updateSale,
  deleteSingleSale,
  deleteSale,
  ascSale,
  oneDayPrevious,
  oneDayNext,
} from "../../api/endpoints/lubeSale.js";

import SideBar from "../sidebar/sideBar";
import Header from "../header/header";
import "./lubeSale.css";
import { authSelector } from "../../store/selectors/index";
import { Modal, message } from "antd";
import { Button, Dropdown, Select, Menu } from "antd";
import { useSelector } from "react-redux";
import Popup from "../modals/Popup";
import {
  getItemRate,
  getRemainingItemQuantity,
} from "../../api/endpoints/item";

const { Option } = Select;

const LubeSale = () => {
  const { user, access_token } = useSelector(authSelector);

  const [voucher, setVoucher] = useState();
  //   const [voucherType] = useState("CV");
  const [type, setType] = useState("ADD");
  const [dateEntered, setDateEntered] = useState("");
  const [shift, setShift] = useState("");
  const [itemsQueue, setItemsQueue] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
  const [fieldsShow, setFieldsShow] = useState(false);
  const [total, setTotal] = useState();
  const [remainingQuantity, setRemainingQuantity] = useState();

  console.log(type, "type");

  // -------------------------- STATE ----------

  const [state, setState] = useState({
    items: [],
    code: "",
    name: "",
    quantity: "",
    saleRate: "",
    purchaseRate: "",
    cashAmount: "",
  });

  const clearState = () => {
    setState({
      items: state.items,
      code: "",
      name: "",
      quantity: "",
      saleRate: "",
      purchaseRate: "",
      cashAmount: "",
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
    if (itemsQueue.length === 0) return message.error("Add minimun 1 Entry");

    const payload = itemsQueue.reduce((acc, curr) => {
      return [
        ...acc,
        {
          enteredOn: dateEntered,
          shift: Number(shift),
          itemCode: curr.code,
          itemName: curr.name,
          quantity: Number(curr.quantity),
          purchaseRate: Number(curr.purchaseRate),
          saleRate: Number(curr.saleRate),
          cashAmount: Number(curr.cashAmount),
          voucherNumber: Number(voucher),
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
    setState({
      ...state,
      items: _items,
    });
  };
  useEffect(() => {
    getAllData();
    if (itemsQueue.length === 0) return;

    let totalAmount = itemsQueue.reduce(
      (arr, curr) => arr + Number(curr?.cashAmount || 0),
      0
    );
    setTotal(Number(totalAmount));

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsQueue]);

  const getItemsaleRate = async () => {
    const data = await getItemRate(state.code, access_token);
    console.log(data,"saleRate")
    if (data.success) {
      setState({
        ...state,
        // tanks: data.data,
        saleRate: data.data.saleRate,
        purchaseRate: data.data.purchaseRate,
      });
    }
  };
  const getRemainingQuantity = async () => {
    const requestData = {
      endingDate: dateEntered,
      itemCode: state.code,
    };
    const data = await getRemainingItemQuantity(requestData, access_token);
    console.log(data, 'getQty')
    if (data.success) {
      setRemainingQuantity(data.data);
      // setState({
      //   ...state,
      //   // tanks: data.data,
      //   saleRate: data.data.saleRate,
      //   purchaseRate: data.data.purchaseRate,
      // });
    }
  };
  useEffect(() => {
    if (state.code) {
      getItemsaleRate();
      getRemainingQuantity();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.code]);

  console.log(remainingQuantity, "totttt");

  // ---------------------- ADD ITEM TO QUEUE --------------

  const addItem = () => {
    console.log(state.quantity, "yuytreqq");
    if (
      !state.code ||
      !state.quantity ||
      Number(state.quantity) === 0 ||
      !state.saleRate ||
      state.quantity > remainingQuantity
    ) {
      return message.error(
        `${
          !state.quantity
            ? "add minimum 1 quantity"
            : !state.saleRate
            ? "Sale Rate"
            : state.quantity > remainingQuantity
            ? "No balance available for sale"
            : !state.code
            ? "Please type Item"
            : Number(state.quantity) === 0
            ? "Quantity must be greater then 0"
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
      if (
        !state.code ||
        !state.quantity ||
        Number(state.quantity) === 0 ||
        !state.saleRate ||
        state.quantity > remainingQuantity
      ) {
        return message.error(
          `${
            !state.quantity
              ? "add minimum 1 quantity"
              : !state.saleRate
              ? "Sale Rate"
              : state.quantity > remainingQuantity
              ? "No balance available for sale"
              : !state.code
              ? "Please type Item"
              : Number(state.quantity) === 0
              ? "Quantity must be greater then 0"
              : ""
          }`
        );
      }
      await updateSingleApi();
    } else {
      if (
        !state.code ||
        !state.quantity ||
        Number(state.quantity) === 0 ||
        !state.saleRate ||
        state.quantity > remainingQuantity
      ) {
        return message.error(
          `${
            !state.quantity
              ? "add minimum 1 quantity"
              : !state.saleRate
              ? "Sale Rate"
              : state.quantity > remainingQuantity
              ? "No balance available for sale"
              : !state.code
              ? "Please type Item"
              : Number(state.quantity) === 0
              ? "Quantity must be greater then 0"
              : ""
          }`
        );
      }
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
            code: curr.itemCode,
            name: curr.itemName,
            quantity: Number(curr.quantity),
            purchaseRate: Number(curr.purchaseRate),
            saleRate: Number(curr.saleRate),
            cashAmount: Number(curr.cashAmount),
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
      itemCode: state.code,
      itemName: state.name,
      quantity: Number(state.quantity),
      purchaseRate: Number(state.purchaseRate),
      saleRate: Number(state.saleRate),
      cashAmount: Number(state.cashAmount),
    };

    console.log(payload, "payyyyyyyyy");
    const response = await updateSale(payload, access_token);
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
    console.log("deleteSingle");
    const results = await deleteSingleSale(id, access_token);
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
      content: "Are you sure you want to delete this Record?",
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
    const results = await deleteSale(voucher, access_token);
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

  //----------------order by desc----------------------
  const descVoucher = async () => {
    const results = await descSale(access_token);
    console.log(results, "ressaaaaa");
    if (results.success) {
      const payload = results.data.reduce((acc, curr) => {
        return [
          ...acc,
          {
            id: curr.id,
            dateEntered: curr.enteredOn,
            shift: curr.shift,
            code: curr.itemCode,
            name: curr.itemName,
            quantity: Number(curr.quantity),
            purchaseRate: Number(curr.purchaseRate),
            saleRate: Number(curr.saleRate),
            cashAmount: Number(curr.cashAmount),
            voucher: curr.voucherNumber,
            items: state.items,
          },
        ];
      }, []);
      setItemsQueue(payload);
      setDateEntered(results.data[0].enteredOn);
      setVoucher(results.data[0].voucherNumber);
      setShift(results.data[0].shift);

      // setEditpopup(false);
      // setType("EDIT");
    } else {
      message.error(results.message);
    }
  };

  const ascVoucher = async () => {
    const results = await ascSale(access_token);
    console.log(results, "ressaaaaa");
    if (results.success) {
      const payload = results.data.reduce((acc, curr) => {
        return [
          ...acc,
          {
            id: curr.id,
            dateEntered: curr.enteredOn,
            shift: curr.shift,
            code: curr.itemCode,
            name: curr.itemName,
            quantity: Number(curr.quantity),
            purchaseRate: Number(curr.purchaseRate),
            saleRate: Number(curr.saleRate),
            cashAmount: Number(curr.cashAmount),
            voucher: curr.voucherNumber,
            items: state.items,
          },
        ];
      }, []);
      setItemsQueue(payload);
      setDateEntered(results.data[0].enteredOn);
      setVoucher(results.data[0].voucherNumber);
      setShift(results.data[0].shift);

      // setEditpopup(false);
      // setType("EDIT");
    } else {
      message.error(results.message);
    }
  };

  const onePreVoucher = async () => {
    const data = {
      enteredOn: dateEntered,
      shift,
      voucherNumber: voucher,
    };
    const results = await oneDayPrevious(data, access_token);
    console.log(results, "ressaaaaa");
    if (results.success) {
      const payload = results.data.reduce((acc, curr) => {
        return [
          ...acc,
          {
            id: curr.id,
            dateEntered: curr.enteredOn,
            shift: curr.shift,
            code: curr.itemCode,
            name: curr.itemName,
            quantity: Number(curr.quantity),
            purchaseRate: Number(curr.purchaseRate),
            saleRate: Number(curr.saleRate),
            cashAmount: Number(curr.cashAmount),
            voucher: curr.voucherNumber,
            items: state.items,
          },
        ];
      }, []);
      setItemsQueue(payload);
      setDateEntered(results.data[0].enteredOn);
      setVoucher(results.data[0].voucherNumber);
      setShift(results.data[0].shift);

      // setEditpopup(false);
      // setType("EDIT");
    } else {
      message.error(results.message);
    }
  };

  const oneNextVoucher = async () => {
    const data = {
      enteredOn: dateEntered,
      shift,
      voucherNumber: voucher,
    };
    const results = await oneDayNext(data, access_token);
    console.log(results, "ressaaaaa");
    if (results.success) {
      const payload = results.data.reduce((acc, curr) => {
        return [
          ...acc,
          {
            id: curr.id,
            dateEntered: curr.enteredOn,
            shift: curr.shift,
            code: curr.itemCode,
            name: curr.itemName,
            quantity: Number(curr.quantity),
            purchaseRate: Number(curr.purchaseRate),
            saleRate: Number(curr.saleRate),
            cashAmount: Number(curr.cashAmount),
            voucher: curr.voucherNumber,
            items: state.items,
          },
        ];
      }, []);
      setItemsQueue(payload);
      setDateEntered(results.data[0].enteredOn);
      setVoucher(results.data[0].voucherNumber);
      setShift(results.data[0].shift);

      // setEditpopup(false);
      // setType("EDIT");
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
              console.log(itemsQueue, "edit");
            }}
          >
            Edit
          </button>
        </Menu.Item>
        {type === "SAVE" ? (
          <Menu.Item key="1">
            <button
              onClick={() => {
                deleteItem(index);
              }}
            >
              {" "}
              Delete
            </button>
          </Menu.Item>
        ) : (
          <Menu.Item key="1">
            <button
              onClick={() => {
                confirmDelete(itemsQueue[index].id);
              }}
            >
              {" "}
              Delete
            </button>
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
            <h3 className=" text-white tableHeading pl-10">LUBE SALE</h3>
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
              <input
                readOnly
                value={user.id}
                className="inpTxt text-black p-1 h-8 ml-3 w-28"
              />
              <input
                value={user.name}
                className="inpTxt text-black p-1 h-8 ml-3 w-96"
              />
              {/* {fieldsShow && (
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
              )} */}
            </div>
          </div>
          {fieldsShow && (
            <div className="">
              <div className="flex content-center flex-wrap pt-5">
                <div className="">
                  {/* <Select
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
                  </Select> */}
                  <Select
                    className="p-1 h-8 ml-3"
                    showSearch
                    placeholder="Select item"
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
                    className="p-1 h-8 ml-3 w-96"
                    showSearch
                    placeholder="Select Product Name"
                    optionFilterProp="children"
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
                </div>

                {/* <div className="">
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
                </div> */}
                <input
                  type="text"
                  name="quantity"
                  value={state.quantity}
                  onChange={(e) => {
                    if (state.saleRate) {
                      setState({
                        ...state,
                        cashAmount: e.target.value * state.saleRate,
                        quantity: e.target.value,
                      });
                    } else {
                      setState({ ...state, quantity: e.target.value });
                    }
                  }}
                  placeholder="Qty"
                  className=" bg-black text-white inpTxt p-2 h-9 ml-3  w-16"
                />
                <input
                  type="number"
                  name="saleRate"
                  //   disabled={Boolean(state.cashAmount)}
                  value={state.saleRate}
                  // onChange={onChangeText}
                  onChange={(e) => {
                    if (state.quantity) {
                      setState({
                        ...state,
                        cashAmount: e.target.value * state.quantity,
                        saleRate: e.target.value,
                      });
                    } else {
                      setState({ ...state, saleRate: e.target.value });
                    }
                  }}
                  placeholder="S/Rate"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-16"
                />
                <input
                  hidden
                  type="text"
                  name="cheque"
                  value={state.purchaseRate}
                  onChange={onChangeText}
                  placeholder="Chq/DD"
                  className="bg-black text-slate-400 inpTxt mt-2 p-2 h-9 ml-3  w-20"
                />

                <input
                  type="number"
                  name="cashAmount"
                  id=""
                  //   disabled={Boolean(state.saleRate)}
                  value={state.cashAmount}
                  onChange={(e) => {
                    if (state.quantity) {
                      setState({
                        ...state,
                        saleRate: e.target.value / state.quantity,
                        cashAmount: e.target.value,
                      });
                    } else {
                      setState({ ...state, cashAmount: e.target.value });
                    }
                  }}
                  placeholder="Amount"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-28"
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
                        Item
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Item Name
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Quantity
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        S/Rate
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Amount
                      </th>
                      {(type === "EDIT" || type === "SAVE") && (
                        <th className="pt-3 pb-3 fontSize" scope="col">
                          ACTION
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="tableBody">
                    {itemsQueue.map((ele, i) => {
                      return (
                        <tr key={i} className="tbodyData text-white">
                          <td className="pl-3 pt-3 pb-3">{i + 1}</td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.code}</p>
                          </td>{" "}
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.name}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.quantity}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.saleRate}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.cashAmount}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            {(type === "SAVE" || type === "EDIT") && (
                              <Dropdown
                                overlay={menu(i)}
                                placement="bottomLeft"
                              >
                                <Button>Action</Button>
                              </Dropdown>
                            )}
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
                    <button
                      onClick={ascVoucher}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                    >
                      <img src={`./img/first.png`} alt="" />
                    </button>
                    <button
                      onClick={onePreVoucher}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      <img src={`./img/previous.png`} alt="" />
                    </button>
                    <button
                      onClick={oneNextVoucher}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      <img src={`./img/next.png`} alt="" />
                    </button>
                    <button
                      onClick={descVoucher}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
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

export default LubeSale;
