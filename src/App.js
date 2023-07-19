import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Fragment, useEffect } from "react";
import Main from "./components/main/main";
import Meter from "./components/meter/meter";
import Dip from "./components/dip/dips";
import Report from "./components/Report/report";
import Login from "./components/User/login";
import Purchase from "./components/purchase/purchase";
import { useSelector, useDispatch } from "react-redux";
import { authSelector } from "./store/selectors/index";
import { logoutAction } from "./store/actions/auth.action";
import Receipts from "./components/receipts/receipts";
import Payment from "./components/payment/payment";
import JV from "./components/journalVoucher/journalVoucher";
import LubeSale from "./components/lubeSale/lubeSale.jsx";
import OpeningStock from "./components/openingStock/openingStock";
import ChartOfAccount from "./components/chartOfAccount/chartOfAccount";
import Party from "./components/party/party";
import Register from "./components/User/registerUser";
// import Example from "./components/Report/calling";
import jwt_decode from "jwt-decode";
import Nozel from "./components/nozel/nozel";
import Tank from "./components/tank/tank";
import SideBar from "./components/sidebar/sideBar";
function App() {
  // const { loading } = useUserContext();

  return (
    <Router>
      {/* {loading && <Loader />} */}
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const { user, access_token } = useSelector(authSelector);
  const isAuth = user && access_token ? true : false;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = access_token;

    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      // Set timer to log out user when token expires
      const expirationTime = decodedToken.exp - currentTime;

      setTimeout(() => {
        console.log("setTimeOut");
        dispatch(logoutAction());
        navigate("/");
      }, expirationTime * 1000);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Routes>
        {isAuth ? (
          <Fragment>
            {/* <Route path="/main" element={<Main />}></Route> */}
            <Route
              path="/meter"
              element={
                <SideBar
                  childComponent={user.role === "admin" ? <Meter /> : <Main />}
                />
              }
            ></Route>
            <Route
              path="/dip"
              element={<SideBar childComponent={<Dip />} />}
            ></Route>
            <Route
              path="/purchase"
              element={<SideBar childComponent={<Purchase />} />}
            ></Route>
            <Route
              path="/receipts"
              element={<SideBar childComponent={<Receipts />} />}
            ></Route>
            <Route
              path="/payment"
              element={<SideBar childComponent={<Payment />} />}
            ></Route>
            <Route
              path="/journalVoucher"
              element={<SideBar childComponent={<JV />} />}
            ></Route>
            <Route
              path="/lubeSale"
              element={<SideBar childComponent={<LubeSale />} />}
            ></Route>
            <Route
              path="/openingStock"
              element={<SideBar childComponent={<OpeningStock />} />}
            ></Route>
            <Route
              path="/report"
              element={<SideBar childComponent={<Report />} />}
            ></Route>
            <Route
              path="/nozel"
              element={<SideBar childComponent={<Nozel />} />}
            ></Route>
            <Route
              path="/tank"
              element={<SideBar childComponent={<Tank />} />}
            ></Route>
            <Route
              path="/chartOfAccount"
              element={<SideBar childComponent={<ChartOfAccount />} />}
            ></Route>
            <Route
              path="/party"
              element={<SideBar childComponent={<Party />} />}
            ></Route>
            <Route
              path="/registerUser"
              element={<SideBar childComponent={<Register />} />}
            ></Route>

            {/* <Route path="/stockBalence" element={<Example />}></Route> */}

            <Route
              path="*"
              element={
                <SideBar childComponent={<Navigate to="/meter" replace />} />
              }
            />
          </Fragment>
        ) : (
          <Fragment>
            <Route
              path="/"
              element={<SideBar childComponent={<Login />} />}
            ></Route>
            <Route
              path="*"
              element={<SideBar childComponent={<Navigate to="/" replace />} />}
            />
          </Fragment>
        )}
      </Routes>
    </>
  );
}

export default App;
