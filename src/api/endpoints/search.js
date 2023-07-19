import { callGet } from "../integrations/calls";
// import { callGet, callPost, callPutById, callDelete } from "../integrations/calls";


import { REQ } from "../../libs/constants";

export const getAllItemsSearch = async (token) => {
    return await callGet(`${REQ.SEARCH.ALL_ITEMS}`, token)
}

export const getAllPartySearch = async (token) => {
    return await callGet(`${REQ.SEARCH.GET_ALL_PARTY}`, token)
}

export const getAllGeneralLedger= async (token)=>{
    return await callGet(`${REQ.SEARCH.GET_GENERAL_LEDGER}`, token)   
}

export const getAllBank= async (token)=>{
    return await callGet(`${REQ.SEARCH.GET_BANK}`, token)   
}