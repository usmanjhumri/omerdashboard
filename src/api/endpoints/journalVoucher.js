import { callGet, callPost, callDelete } from "../integrations/calls";
import { REQ } from "../../libs/constants";

export const getVoucher = async (data, token) => {
    return await callPost(REQ.JV.GET_VOUCHER, data, token)
}


export const saveData = async (data, token) => {
    return await callPost(REQ.JV.SAVE_DATA, data, token)
}

export const getData = async (id, token) => {
    return await callGet(`${REQ.JV.GET_DATA}/${id}`, token)
}

export const updateJV = async (data, token) => {
    return await callPost(`${REQ.JV.UPDATE_JOURNAL}`, data, token)
}

export const deleteSingleJournal = async (id, token) => {
    return await callDelete(`${REQ.JV.DELETE_SINGLE_TRANSACTION}/${id}`, {}, token);
};

export const deleteVoucher = async (id, token) => {
    return await callDelete(`${REQ.JV.DELETE_VOUCHER}/${id}`, {}, token);
};

export const deleteZeroEntry = async (token) => {
    return await callDelete(`${REQ.JV.DELETE_ZERO_ENRTY}`,{}, token);
};