import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
// import DataContext from './dataContext';

import { ComponentToPrint } from "./print";

const Example = ({ item }) => {
  // const { itemsQueue } = useContext(DataContext);
  //   console.log(itemsQueue, "itemm");

  //   const [first, setfirst] = useState([]);
  console.log(item, "itemm");
  const componentRef = useRef();

  //   useEffect(() => {
  //    setfirst(item)
  //   }, [item])

  return (
    <div>
      <ComponentToPrint ref={componentRef} item={item} />
      <ReactToPrint
        trigger={() => (
          <button className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded">
            Print this out!
          </button>
        )}
        content={() => componentRef.current}
        documentTitle="Stock Balences"
        pageStyle="print"
      />
    </div>
  );
};

export default Example;
