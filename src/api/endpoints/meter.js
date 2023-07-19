import { callGet, callPost, callPutById, callDelete } from "../integrations/calls";

import { REQ } from "../../libs/constants";

export const statusApi = async () => {
  return await callGet(REQ.STATUS)
}


export const add = async (data, token) => {
  return await callPost(REQ.METER.ADD, data, token);
};

export const createMeter = async (data, token) => {
  return await callPost(REQ.METER.ADD_METER, data, token);
};

export const updateMeter = async (data, token) => {
  return await callPost(REQ.METER.EDIT_METER, data, token);
};

export const updateSingleMeter = async (data, token) => {
  return await callPutById(`${REQ.METER.UPDATE_SINGLE_METER}/${data.id}`, data, token);
};

export const viewMeter = async (data, token) => {
  return await callPost(REQ.METER.VIEW_METER, data, token);
};

export const deleteMeter = async (data, token) => {
  return await callDelete(`${REQ.METER.DELETE_METER}/${data.date}/${data.shift}`, data, token);
};

export const descMeter = async (token) => {
  return await callGet(REQ.METER.ORDER_BY_DESC,  token);
};

export const ascMeter = async (token) => {
  return await callGet(REQ.METER.ORDER_BY_ASC,  token);
};

export const oneDayPrevious = async (data, token) => {
  return await callPost(REQ.METER.ONE_DAY_PRE, data, token);
};

export const oneDayNext = async (data, token) => {
  return await callPost(REQ.METER.ONE_DAY_NEXT, data, token);
};

export const report = async (data) => {
  return await callPost(REQ.METER.GET_REPORT, data);
}
