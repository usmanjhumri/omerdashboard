// import { callGet, callPost, callPutById, callDelete } from "../integrations/calls";
import { callPost } from "../integrations/calls";


import { REQ } from "../../libs/constants";

export const getStockBal = async (data, token) => {
    return await callPost(REQ.ALL_REPORTS.GET_STOCK_BALENCE, data, token);
};
