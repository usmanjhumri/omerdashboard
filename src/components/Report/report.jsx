import React, { useState } from "react";
import { getStockBal } from "../../api/endpoints/allReports";
import { authSelector } from "../../store/selectors/index";
import { useSelector } from "react-redux";
import { message } from "antd";
import Example from "./calling.js";
import SideBar from "../sidebar/sideBar";
import Header from "../header/header";

const Report = () => {
  const { access_token } = useSelector(authSelector);
  const [dateEntered, setDateEntered] = useState("");
  const setDate = (e) => {
    setDateEntered(e.target.value);
  };
  console.log(dateEntered);
  const [itemsQueue, setItemsQueue] = useState([]);
  //   const [data, setData] = useState({
  //     enteredOn : "",
  //     itemCode: "",
  //     itemName: "",
  //     quantity: "",
  //     rate: ""
  //   })
  const editHandler = async (e) => {
    if (!dateEntered) return message.error("Please type date !");
    let data = {
      p_enteredOn: dateEntered
    }
    const results = await getStockBal(data, access_token);
    console.log(results, "ressaaaaa");
    if (results.success) {
      const payload = results.data.reduce((acc, curr) => {
        return [
          ...acc,
          {
            enteredOn: curr.enteredOn,
            itemCode: curr.itemCode,
            itemName: curr.itemName,
            quantity: Number(curr.quantity),
            purchaseRate: Number(curr.rate),
          },
        ];
      }, []);
      setItemsQueue(payload);
      //   setItemsQueue(results.data);
      console.log(itemsQueue, "FUn");
      //   if (results.data.length > 0) {
      //     navigate("/stockBalence");
      //   }
    } else {
      message.error(results.message);
    }
  };

  const clearState = () => {
    setItemsQueue([]);
  };

  console.log(itemsQueue, "payy");
  return (
    <>
      {itemsQueue.length > 0 ? (
        <>
          <div style={{ backgroundColor: "" }}>
            {itemsQueue.length > 0 && (
              <Example item={itemsQueue} />
            )}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
            onClick={clearState}
          >
            Exit
          </button>
        </>
      ) : (
        <>
          <div className="flex  bg-black main">
            {/* <SideBar /> */}
            <div className="h-full  flex flex-col content-center  w-full">
              {/* <Header /> */}
              <div className="flex justify-center">
                <div className="meterTableMain flex flex-col justify-items-center justify-center w-1/2 ml-10 mt-5 mr-10">
                  <div className="bg-blue-500 headingBox flex justify-center">
                    <h1 className=" text-white">STOCK BALENCE</h1>
                  </div>
                  <div className="flex flex-col  h-40 content-center items-center justify-items-center justify-evenly">
                    <div>
                      <label className="text-white" for="fname">
                        Date:
                      </label>
                      <input
                        type="date"
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                        onChange={setDate}
                      />
                    </div>
                    <div>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                        onClick={editHandler}
                      >
                        View
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded">
                        clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Report;
