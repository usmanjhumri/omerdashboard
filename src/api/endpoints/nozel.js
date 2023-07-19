import { callGet, callPost, callPutById, callDelete } from "../integrations/calls";

import { REQ } from "../../libs/constants";


export const createNozel = async (data, token) => {
    return await callPost(REQ.NOZEL.ADD_NOZEL, data, token);
};

export const getAllNozel = async(token) => {
    return await callGet(`${REQ.NOZEL.GET_ALL_NOZEL}`, token)
}

export const updateSingleNozel = async (data, token) => {
    return await callPutById(`${REQ.NOZEL.UPDATE_NOZEL}/${data.id}`, data, token);
};

export const deleteSingleNozel = async (data, token) => {
    return await callDelete(`${REQ.NOZEL.DELETE_NOZEL}/${data.id}`, data, token);
};