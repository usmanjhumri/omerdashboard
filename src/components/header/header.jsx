import "./header.css";
import { Link } from "react-router-dom";
import { authSelector } from "../../store/selectors/index";
import { useSelector } from "react-redux";



const Header = () => {
  const { user } = useSelector(authSelector);

  return (
    <>
      {/* <div className="fontHeading pt-1  pb-4 text-white  ">
        <h3 className="mt-6 ml-14 ">
          Site Management System (Sales,Inventory and Accounts System)
        </h3>
      </div>
      <div className="navR menu-bar w-full text-white pt-2 pb-3">
        <ul className="ml-14 w-3/5 flex justify-between cursor-pointer">
          <li className=" hover:bg-blue-500 p-2">File</li>
          <li className=" hover:bg-blue-500 p-2 ">
            Data Storage
            <div className="dropdown-menu ">
              <ul>
                <Link to="">
                  <li className="hover:bg-blue-500 text-white">Add Item</li>
                </Link>
                <Link to="/openingStock">
                  <li className="hover:bg-blue-500 text-white">
                    Opening Stock
                  </li>
                </Link>
                <li className="hover:bg-blue-500 text-white">
                  Insert DipChart
                </li>
                <li className="hover:bg-blue-500 text-white">
                  Add
                  <div class="dropdown-menu-1">
                    <ul>
                      <Link to="/party">
                        {" "}
                        <li className="hover:bg-blue-500 text-white">
                          Party Account
                        </li>{" "}
                      </Link>
                      <Link to="/chartOfAccount">
                        <li className="hover:bg-blue-500 text-white">
                          Chart Of Account
                        </li>
                      </Link>
                      <Link to="/nozel">
                        <li className="hover:bg-blue-500 text-white">Nozel</li>
                      </Link>
                      <Link to="/tank">
                        <li className="hover:bg-blue-500 text-white">Tank</li>
                      </Link>
                     { user.role === "admin" && <Link to="/registerUser">
                        <li className="hover:bg-blue-500 text-white">
                          New User
                        </li>
                      </Link>}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li className="hover:bg-blue-500 p-2">Reports</li>
          <li className="hover:bg-blue-500 p-2">Admin</li>
          <li className="hover:bg-blue-500 p-2">Help</li>
          <li className="hover:bg-blue-500 p-2">Accounts</li>
          <li className="hover:bg-blue-500 p-2">Day Data</li>
          <li className="hover:bg-blue-500 p-2">Day Reports</li>
        </ul>
      </div> */}
    </>
  );
};

export default Header;
