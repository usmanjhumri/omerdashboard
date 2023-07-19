// import { callGet, callPost, callPutById, callDelete } from "../integrations/calls";
import { callGet } from "../integrations/calls";


import { REQ } from "../../libs/constants";

export const getSiteRefrence = async (token) => {
    return await callGet(REQ.REFRENCES.GET_STITE_NAME, token);
};
