import React, { useState, useEffect } from "react";
import { getAllItemsSearch } from "../../api/endpoints/search";
import {
  saveData,
  getData,
  getDate,
  updateBalence,
  deleteSingle,
  deleteWholeBal,
} from "../../api/endpoints/openingStock.js";

import SideBar from "../sidebar/sideBar";
import Header from "../header/header";
import "./openingStock.css";
import { authSelector } from "../../store/selectors/index";
import { useSelector } from "react-redux";
import { Modal, message } from "antd";
import { Button, Dropdown, Select, Menu } from "antd";
import { getTankById } from "../../api/endpoints/tank";

const { Option } = Select;

const OpeningStock = () => {
  const { user, access_token } = useSelector(authSelector);

  const [type, setType] = useState("ADD");
  const [dateEntered, setDateEntered] = useState("");
  const [itemsQueue, setItemsQueue] = useState([]);
  const [editedItem, setEditedItem] = useState(null);
  const [fieldsShow, setFieldsShow] = useState(false);
  const [total, setTotal] = useState(0);

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
    tanks: [],
    tank: "",
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
      tanks: state.tanks,
      tank: "",
    });
  };

  const clearStates = () => {
    clearState();
    setEditedItem(null);
    setFieldsShow(false);
    setItemsQueue([]);
    setDateEntered("");
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
    const result = await getDate(access_token);
    console.log(result, "result");
    if (result.success) {
      setDateEntered(result.data);
      setType("SAVE");
      setFieldsShow(true);
    } else {
      message.error(result.message);
    }
  };
  // ------------------ SAVE DATA -----------------
  console.log(state, "state-=-=-=", type);
  console.log(dateEntered, "date-=-=-=");


  const save = async () => {
    if (itemsQueue.length === 0) return message.error("Add minimun 1 Entry");
    const payload = itemsQueue.reduce((acc, curr) => {
      return [
        ...acc,
        {
          enteredOn: dateEntered,
          itemCode: curr.code,
          itemName: curr.name,
          quantity: Number(curr.quantity),
          purchaseRate: Number(curr.purchaseRate),
          saleRate: Number(curr.saleRate),
          amount: Number(curr.cashAmount),
          tankNumber: curr.tank,
          grpId: Number(user.grpId),
          siteId: Number(user.siteId),
          companyCode: Number(user.companyCode),
        },
      ];
    }, []);
    console.log(payload, "payload");
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

  console.log(total, "totttt");

  // ---------------------- ADD ITEM TO QUEUE --------------

  const addItem = () => {
    if (
      !state.code ||
      !state.quantity ||
      !state.purchaseRate ||
      !state.saleRate ||
      state.purchaseRate > state.saleRate
    ) {
      return message.error(
        `Please type ${!state.code
          ? "add item code"
          : !state.quantity
            ? "add minimum 1 quantity"
            : !state.purchaseRate
              ? "Purchase Rate"
              : !state.saleRate
                ? "Sale Rate"
                : state.purchaseRate > state.saleRate
                  ? "Cost Price is LESS than Sale Rate"
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
    console.log("deleteItem");
    clearState();
  };

  // ---------------------- EDIT API ------------------

  const editHandler = async () => {
    const results = await getData(access_token);
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
            cashAmount: Number(curr.amount),
            items: state.items,
            tanks: state.tanks,
            tank: curr.tankNumber
          },
        ];
      }, []);
      setDateEntered(results.data[0].enteredOn);
      setItemsQueue(payload);
      setType("EDIT");
    } else {
      message.error(results.message);
    }
  };

  // ---------------------- EDIT SINGLE API ------------------

  const updateSingleApi = async () => {
    if (
      !state.code ||
      !state.quantity ||
      !state.purchaseRate ||
      !state.saleRate ||
      state.purchaseRate > state.saleRate
    ) {
      return message.error(
        `Please type ${!state.code
          ? "add item code"
          : !state.quantity
            ? "add minimum 1 quantity"
            : !state.purchaseRate
              ? "Purchase Rate"
              : !state.saleRate
                ? "Sale Rate"
                : state.purchaseRate > state.saleRate
                  ? "Cost Price is LESS than Sale Rate"
                  : ""
        }`
      );
    } else {
      const payload = {
        id: state.id,
        itemCode: state.code,
        itemName: state.name,
        quantity: Number(state.quantity),
        purchaseRate: Number(state.purchaseRate),
        saleRate: Number(state.saleRate),
        amount: Number(state.cashAmount),
      };

      console.log(payload, "payyyyyyyyy");
      const response = await updateBalence(payload, access_token);
      if (response.success) {
        await editHandler();
        message.success(response.message);
        clearState();
        setFieldsShow(false);
      } else {
        message.error(response.message);
      }
    }
  };

  // ---------------- DELETE PURCHASE

  // -------- single

  const [modal, contextHolder] = Modal.useModal();
  const deleteSinglePurchase = async (id) => {
    console.log("deleteSingle");
    const results = await deleteSingle(id, access_token);
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

  const deletePurchaseHandler = async () => {
    const results = await getData(access_token);
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
            cashAmount: Number(curr.amount),
            items: state.items,
            tanks: state.tanks,
          },
        ];
      }, []);
      setItemsQueue(payload);
      setDateEntered(results.data[0].enteredOn);
      confirmDeleteAll();
    } else {
      message.error(results.message);
    }
  };
  const deleteBalApi = async () => {
    const results = await deleteWholeBal(access_token);
    if (results.success) {
      message.success("Record Deleted Successfully !");
      clearStates();
    } else {
      message.error(results.message);
    }
  };

  const confirmDeleteAll = () => {
    modal.confirm({
      title: `Confirm`,
      content: "Are you sure you want to delete this?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => deleteBalApi(),
    });
  };

  const viewOpeningBal = async () => {
    const results = await getData(access_token);
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
            cashAmount: Number(curr.amount),
            items: state.items,
            tanks: state.tanks,
            tank: curr.tankNumber
          },
        ];
      }, []);
      setItemsQueue(payload);
      setDateEntered(results.data[0].enteredOn);
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
      {/* <SideBar /> */}
      <div className="h-full  flex flex-col content-center  w-full">
        {/* <Header /> */}
        <div className="meterTableMain ml-10 mt-5 mr-10">
          {contextHolder}
          <div className="bg-blue-500 headingBox flex justify-between">
            <h3 className=" text-white tableHeading pl-10">OPENING STOCK</h3>
          </div>
          <div className="bg-blue-500">
            <div className="flex content-center pt-5">
              <input
                type="date"
                value={dateEntered}
                className="text-black inpTxt p-2 h-8 ml-3 mb-3"
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
            </div>
          </div>
          {fieldsShow && (
            <div className="">
              <div className="flex content-center flex-wrap pt-5">
                <div className="">
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
                <input
                  type="text"
                  name="quantity"
                  value={state.quantity}
                  onChange={(e) => {
                    if (state.purchaseRate) {
                      setState({
                        ...state,
                        cashAmount: e.target.value * state.purchaseRate,
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
                  name="cost"
                  //   disabled={Boolean(state.cashAmount)}
                  value={state.purchaseRate}
                  // onChange={onChangeText}
                  onChange={(e) => {
                    if (state.quantity) {
                      setState({
                        ...state,
                        cashAmount: e.target.value * state.quantity,
                        purchaseRate: e.target.value,
                      });
                    } else {
                      setState({ ...state, purchaseRate: e.target.value });
                    }
                  }}
                  placeholder="Cost"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-16"
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
                        purchaseRate: e.target.value / state.quantity,
                        cashAmount: e.target.value,
                      });
                    } else {
                      setState({ ...state, cashAmount: e.target.value });
                    }
                  }}
                  placeholder="Amount"
                  className="bg-black text-slate-400 inpTxt p-2 h-9 ml-3  w-28"
                />
                <input
                  type="text"
                  name="saleRate"
                  value={state.saleRate}
                  onChange={onChangeText}
                  placeholder="S/Rate"
                  className="bg-black text-slate-400 inpTxt mt-2 p-2 h-9 ml-3  w-20"
                />
                <Select
                  showSearch
                  placeholder="Tank"
                  optionFilterProp="children"
                  className="p-2 h-9 ml-3 "
                  value={state.tank || "Tank"}
                  onChange={(e) => {
                    setState({ ...state, tank: e });
                  }}
                >
                  <Option value={"None"}>None</Option>
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
                        P/Rate
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        S/Rate
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Amount
                      </th>
                      <th className="pt-3 pb-3 fontSize" scope="col">
                        Tank
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
                            <p className="fontSize">
                              {parseFloat(ele.purchaseRate).toFixed(2)}
                            </p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.saleRate}</p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">
                              {parseFloat(ele.cashAmount).toFixed(2)}
                            </p>
                          </td>
                          <td className="pt-3 pb-3">
                            <p className="fontSize">{ele.tank}</p>
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
                    value={parseFloat(total).toFixed(2)}
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
                        onClick={editHandler}
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => deletePurchaseHandler()}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                      disabled={type !== "ADD"}
                    >
                      Delete
                    </button>
                    <button onClick={viewOpeningBal} className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded">
                      View
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningStock;
