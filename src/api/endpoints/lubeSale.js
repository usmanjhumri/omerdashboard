import { callGet, callPost, callDelete, callPut } from "../integrations/calls";
import { REQ } from "../../libs/constants";

export const getVoucher = async (data, token) => {
    return await callPost(REQ.LUBE.GET_VOUCHER, data, token)
}

export const saveData = async (data, token) => {
    return await callPost(REQ.LUBE.SAVE_DATA, data, token)
}

export const getData = async (id, token) => {
    return await callGet(`${REQ.LUBE.GET_DATA}/${id}`, token)
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

export const updateSale = async (data, token) => {
    return await callPut(`${REQ.LUBE.UPDATE_SALE}/${data.id}`, data, token)
}

export const deleteSingleSale = async (id, token) => {
    return await callDelete(`${REQ.LUBE.DELETE_SINGLE_SALE}/${id}`, {}, token);
};

export const deleteSale = async (id, token) => {
    return await callDelete(`${REQ.LUBE.DELETE_SALE_VOUCHER}/${id}`, {}, token);
};

export const descSale = async (token) => {
    return await callGet(REQ.LUBE.ORDER_BY_DESC,  token);
  };
  
  export const ascSale = async (token) => {
    return await callGet(REQ.LUBE.ORDER_BY_ASC,  token);
  };
  
  export const oneDayPrevious = async (data, token) => {
    return await callPost(REQ.LUBE.ONE_DAY_PRE, data, token);
  };
  
  export const oneDayNext = async (data, token) => {
    return await callPost(REQ.LUBE.ONE_DAY_NEXT, data, token);
  };