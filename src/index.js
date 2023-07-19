import React from "react";
import ReactDOM from "react-dom/client";
import 'antd/dist/reset.css';

import App from "./App";
// import PropsProvider from "./contexts/UserContext";

import "react-toastify/dist/ReactToastify.css";
import "swiper/css/pagination";
import "swiper/css";
import "./assets/styles/base/index.css";
import { Provider } from 'react-redux';
import { store } from './store/index'


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
// <PropsProvider>
  <Provider store={store}>

    <App />
  </Provider>

  // </PropsProvider>
);
