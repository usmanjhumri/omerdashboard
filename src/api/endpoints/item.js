// import { callGet, callPost, callPutById, callDelete } from "../integrations/calls";
import { callGet, callPost } from "../integrations/calls";


import { REQ } from "../../libs/constants";

export const getItemCode = async (id, token) => {
    return await callGet(`${REQ.ITEM.GET_ITEM}/${id}`, token)
}

export const getItemRate = async (id, token) => {
    return await callGet(`${REQ.ITEM.GET_ITEM_RATE}/${id}`, token)
}

export const getRemainingItemQuantity = async (data, token) => {
    return await callPost(`${REQ.ITEM.GET_ITEM_QUANTITY}`,data, token)
}