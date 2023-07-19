import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../store/actions/auth.action";
import { ERoutes } from "../../enums/routes";
import { Box, Container, Grid } from "@material-ui/core";

const SideBar = ({ childComponent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const [open, setOpen] = useState(true);

  const logout = () => {
    dispatch(logoutAction());
    navigate("/");
  };
  return (
    <>
      <Box>
        <Grid container>
          <Grid item xs={5} md={2}>
            <div
              className={` ${
                open ? "auto" : "w-20 "
              }  h-screen  navClass  pt-8  relative duration-300  `}
            >
              <img
                src="./assets/control.png"
                alt=""
                className={`absolute arrow cursor-pointer -right-3 top-9 w-7 
       border-2 rounded-full  ${!open && "rotate-180"}`}
                onClick={() => setOpen(!open)}
              />
              <Link to="/">
                <div className="flex gap-x-4 items-center">
                  <img
                    src="./assets/logo.png"
                    alt=""
                    className={`cursor-pointer duration-500 ${
                      open && "rotate-[360deg]"
                    }`}
                  />
                  <h1
                    className={`text-white origin-left logoHeading font-medium text-xl duration-200 ${
                      !open && "scale-0"
                    }`}
                  >
                    IT WORLD
                    {/* IT W<span class="braces">&#123;&#125;</span>RLD */}
                  </h1>
                </div>
              </Link>
              <ul className="pt-4">
                <Link to="/meter">
                  <li
                    className={`flex ${
                      pathname === ERoutes.METER ? "bg-blue-500" : ""
                    } rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                  >
                    <img src={`./assets/Meters.png`} alt="" />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      METERS
                    </span>
                  </li>
                </Link>
                <Link to="/dip">
                  <li
                    className={`flex ${
                      pathname === ERoutes.DIP ? "bg-blue-500" : ""
                    } rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                  >
                    <img src={`./assets/fuel.png`} alt="" />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      DIPS
                    </span>
                  </li>
                </Link>
                <Link to="/purchase">
                  <li
                    className={`flex ${
                      pathname === ERoutes.PURCHASE ? "bg-blue-500" : ""
                    } rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                  >
                    <img src={`./assets/Purchase.png`} alt="" />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      PURCHASE
                    </span>
                  </li>
                </Link>
                <Link to="/lubeSale">
                  <li
                    className={`flex ${
                      pathname === ERoutes.LUBE_SALE ? "bg-blue-500" : ""
                    } rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                  >
                    <img src={`./assets/Lubes.png`} alt="" />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      LUBES
                    </span>
                  </li>
                </Link>
                <li
                  className={`flex  rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                >
                  <img src={`./assets/creditCard.png`} alt="" />
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    CREDITS
                  </span>
                </li>
                <li
                  className={`flex  rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                >
                  <img src={`./assets/Cards.png`} alt="" />
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    CARDS
                  </span>
                </li>
                <Link to="/receipts">
                  <li
                    className={`flex ${
                      pathname === ERoutes.RECEIPT ? "bg-blue-500" : ""
                    }  rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                  >
                    <img src={`./assets/Receipt.png`} alt="" />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      RECEIPT
                    </span>
                  </li>
                </Link>
                <Link to="/payment">
                  <li
                    className={`flex ${
                      pathname === ERoutes.PAYMENT ? "bg-blue-500" : ""
                    }  rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                  >
                    <img src={`./assets/Payment.png`} alt="" />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      PAYMENT
                    </span>
                  </li>
                </Link>
                <li
                  className={`flex  rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                >
                  <img src={`./assets/Cash.png`} alt="" />
                  <span
                    className={`${!open && "hidden"} origin-left duration-200`}
                  >
                    EXPENSE
                  </span>
                </li>

                <Link to="/journalVoucher">
                  <li
                    className={`flex ${
                      pathname === ERoutes.JV ? "bg-blue-500" : ""
                    } rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                  >
                    <img src={`./assets/Ticket.png`} alt="" />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      JV
                    </span>
                  </li>
                </Link>
                <Link to="/report">
                  <li
                    className={`flex  rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 
           mb-1`}
                  >
                    <img src={`./assets/DailySheet.png`} alt="" />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      DAILY SHEET
                    </span>
                  </li>
                </Link>
              </ul>
              <li
                onClick={logout}
                className={`flex  rounded-md p-2 cursor-pointer hover:bg-blue-500 text-white text-sm items-center gap-x-4 `}
              >
                <img src={`./assets/Logout.png`} alt="" />
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  Logout
                </span>
              </li>
            </div>
          </Grid>
          <Grid item xs={7} md={10}>
            {childComponent}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SideBar;
