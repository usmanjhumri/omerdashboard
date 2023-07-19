import { callGet, callPost, callDelete, callPut } from "../integrations/calls";
import { REQ } from "../../libs/constants";

export const getVoucher = async (data, token) => {
    return await callPost(REQ.PAYMENT.GET_VOUCHER, data, token)
}

export const getTransactionId = async (token) => {
    return await callGet(REQ.PAYMENT.GET_TRANSACTION_ID, token)
}

export const saveData = async (data, token) => {
    return await callPost(REQ.PAYMENT.SAVE_DATA, data, token)
}

export const getData = async (id, token) => {
    return await callGet(`${REQ.PAYMENT.GET_DATA}/${id}`, token)
}

export const descPayment = async (token) => {
    return await callGet(REQ.PAYMENT.ORDER_BY_DESC, token);
};

export const onePreData = async (data, token) => {
    return await callPost(`${REQ.PAYMENT.ONE_DAY_PRE}`,data , token)
}

export const oneNextData = async (data, token) => {
    return await callPost(`${REQ.PAYMENT.ONE_DAY_NEXT}`,data , token)
}

export const ascPayment = async (token) => {
    return await callGet(REQ.PAYMENT.ORDER_BY_ASC, token);
};

export const updateReceipt = async (data, token) => {
    return await callPut(`${REQ.PAYMENT.UPDATE_PAYMENT}/${data.transactionId}`, data, token)
}

export const deleteSingleReceipt = async (id, token) => {
    return await callDelete(`${REQ.PAYMENT.DELETE_SINGLE_PAYMENT}/${id}`, {}, token);
};

export const deleteReceipt = async (id, token) => {
    return await callDelete(`${REQ.PAYMENT.DELETE_PAYMENT}/${id}`, {}, token);
};