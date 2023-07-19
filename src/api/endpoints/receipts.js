import { callGet, callPost, callDelete, callPut } from "../integrations/calls";
import { REQ } from "../../libs/constants";

export const getVoucher = async (data, token) => {
    return await callPost(REQ.RECEIPTS.GET_VOUCHER, data, token)
}

export const getTransactionId = async (token) => {
    return await callGet(REQ.RECEIPTS.GET_TRANSACTION_ID, token)
}


export const saveData = async (data, token) => {
    return await callPost(REQ.RECEIPTS.SAVE_DATA, data, token)
}

export const getData = async (id, token) => {
    return await callGet(`${REQ.RECEIPTS.GET_DATA}/${id}`, token)
}

export const updateReceipt = async (data, token) => {
    return await callPut(`${REQ.RECEIPTS.UPDATE_RECEIPTS}/${data.transactionId}`, data, token)
}

export const deleteSingleReceipt = async (id, token) => {
    return await callDelete(`${REQ.RECEIPTS.DELETE_SINGLE_RECEIPTS}/${id}`, {}, token);
};

export const deleteReceipt = async (id, token) => {
    return await callDelete(`${REQ.RECEIPTS.DELETE_RECEIPTS}/${id}`, {}, token);
};