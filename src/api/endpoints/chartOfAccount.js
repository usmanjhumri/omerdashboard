import { callGet, callPost, callPutById, callDelete } from "../integrations/calls";


import { REQ } from "../../libs/constants";


export const getAllAccountForEdit = async(token) => {
    return await callGet(`${REQ.CHART_OF_ACCOUNT.GET_ALL_ACCOUNT}`, token)
}

export const createAccount = async (data, token) => {
    return await callPost(REQ.CHART_OF_ACCOUNT.ADD_ACCOUNT, data, token);
};


export const updateSingleAccount = async (data, token) => {
    return await callPutById(`${REQ.CHART_OF_ACCOUNT.UPDATE_ACCOUNT}/${data.generalLedgerCode}`, data, token);
};

export const deleteSingleAccount = async (data, token) => {
    return await callDelete(`${REQ.CHART_OF_ACCOUNT.DELETE_ACCOUNT}/${data.generalLedgerCode}`, data, token);
};