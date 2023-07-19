import { callGet, callPost,  callDelete, callPut } from "../integrations/calls";
import { REQ } from "../../libs/constants";

export const getVoucher = async (data, token) => {
    return await callPost(REQ.PURCHASE.GET_VOUCHER, data, token)
}

export const saveData = async (data, token) => {
    return await callPost(REQ.PURCHASE.SAVE_DATA, data, token)
}

export const getData = async (id, token) => {
    return await callGet(`${REQ.PURCHASE.GET_DATA}/${id}`, token)
}

export const updatePurchase = async (data, token) => {
    return await callPut(`${REQ.PURCHASE.UPDATE_PURCHASE}/${data.id}`, data, token)
}

export const deleteSingleInvoivce = async (id, token) => {
    return await callDelete(`${REQ.PURCHASE.DELETE_SINGLE_INVOICE}/${id}`, {}, token);
};

export const deleteInvoivce = async (id, token) => {
    return await callDelete(`${REQ.PURCHASE.DELETE_INVOICE}/${id}`, {}, token);
};

export const getReport = async (token) => {
    return await callGet(`${REQ.PURCHASE.GET_REPORT}`, token)
}