import React, { useEffect } from "react";
import { useState } from "react";
import { getSiteRefrence } from "../../api/endpoints/refrences";
import { authSelector } from "../../store/selectors/index";
import { useSelector } from "react-redux";
import { message } from "antd";

export const ComponentToPrint = React.forwardRef((item, ref) => {
  const { access_token } = useSelector(authSelector);
  const [siteName, setSiteName] = useState();
  const [siteAddress, setSiteAddress] = useState();

  const [total, setTotal] = useState();

  console.log("printjs");
  const [first, setfirst] = useState([]);
  useEffect(() => {
    const updatedOpeningBalances = item.item.map((item) => {
    //   const sum = Number(item.quantity) * Number(item.purchaseRate);
      const multiVal = Number(item.quantity) * Number(item.purchaseRate);
      console.log(multiVal, "saleRate");

      return {
        ...item,
        // openingBalence: Number(sum.toFixed(2)),
        price: Number(multiVal.toFixed(0)),
      };
    });
    setfirst(updatedOpeningBalances);
  }, [item.item]);

  console.log(first, "print");

  const getName = async (e) => {
    const result = await getSiteRefrence(access_token);
    if (result.success) {
      console.log(result, "site");
      setSiteName(result.data.siteName);
      setSiteAddress(result.data.siteAddress);

    } else {
      message.error(result.message);
    }
    if (first.length !== 0) {
      let totalAmount = first.reduce(
        (arr, curr) => arr + Number(curr?.price || 0),
        0
      );
      setTotal(Number(totalAmount));
    }
  };

  useEffect(() => {
    getName();
  });

  return (
    <div ref={ref}>
      <div className="flex flex-col items-center justify-center">
        <h1 style={{ fontSize: "30px" }}>{siteName}</h1>
        <h1 style={{ fontSize: "17px" }}>{siteAddress}</h1>
      </div>
      <div class="relative mt-5 overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">
                SNO.
              </th>
              <th scope="col" class="px-6 py-3">
                Date
              </th>
              <th scope="col" class="px-6 py-3">
                Item Code
              </th>
              <th scope="col" class="px-6 py-3">
                Product name
              </th>
              <th scope="col" class="px-6 py-3">
                Balence Quantity
              </th>
              <th scope="col" class="px-6 py-3">
                Purchase Rate
              </th>
              <th scope="col" class="px-6 py-3">
                Amount
              </th>
            </tr>
          </thead>
          {first.length > 0 &&
            first.map((ele, i) => {
              return (
                <tbody>
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td class="px-6 py-4">{i + 1}</td>
                    <td class="px-6 py-4">{ele.enteredOn}</td>
                    <td class="px-6 py-4">{ele.itemCode}</td>
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {ele.itemName}
                    </th>
                    <td class="px-6 py-4">{ele.quantity}</td>
                    <td class="px-6 py-4">{ele.purchaseRate.toFixed(2)}</td>
                    <td class="px-6 py-4">{ele.price.toFixed(2)}</td>
                  </tr>
                </tbody>
              );
            })}
        </table>
        <div className="flex justify-center mt-3">Total Amount: {total}</div>
      </div>
    </div>
  );
});




