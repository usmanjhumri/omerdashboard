import { callGet, callPost, callPutById, callDelete } from "../integrations/calls";


import { REQ } from "../../libs/constants";

export const getTankById = async (id, token) => {
    return await callGet(`${REQ.TANK.GET_BY_ID}/${id}`, token)
}

export const getAllTank = async(token) => {
    return await callGet(`${REQ.TANK.GET_ALL_TANK}`, token)
}

export const getAllTankForEdit = async(token) => {
    return await callGet(`${REQ.TANK.GET_ALL_TANK_FOR_EDIT}`, token)
}

export const getAllItem = async(token) => {
    return await callGet(`${REQ.TANK.GET_TANK_ITEM}`, token)
}

export const createTank = async (data, token) => {
    return await callPost(REQ.TANK.ADD_TANK, data, token);
};


export const updateSingleTank = async (data, token) => {
    return await callPutById(`${REQ.TANK.UPDATE_TANK}/${data.id}`, data, token);
};

export const deleteSingleTank = async (data, token) => {
    return await callDelete(`${REQ.TANK.DELETE_TANK}/${data.id}`, data, token);
};