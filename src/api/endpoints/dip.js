import {
  callGet,
  callPost,
  callPutById,
  callDelete,
} from "../integrations/calls";

import { REQ } from "../../libs/constants";

export const statusApi = async () => {
  return await callGet(REQ.STATUS);
};

// export const add = async (enteredOn) => {
//   return await callGet(REQ.METER.ADD.replace(":enteredOn", enteredOn));
// };

export const add = async (data, token) => {
  return await callPost(REQ.DIP.ADD, data, token);
};

//calculating quantity
export const getSingleDip = async (data, token) => {
  return await callPost(REQ.DIP.GET_LITRES_MM, data, token);
};

export const updateDip = async (data, token) => {
  return await callPost(REQ.DIP.EDIT_DIP, data, token);
};

export const createDip = async (data, token) => {
  return await callPost(REQ.DIP.ADD_DIP, data, token);
};

export const descDip = async (token) => {
  return await callGet(REQ.DIP.ORDER_BY_DESC, token);
};

export const oneDayPrevious = async (data, token) => {
  return await callPost(REQ.DIP.ONE_DAY_PRE, data, token);
};

export const oneDayNext = async (data, token) => {
  return await callPost(REQ.DIP.ONE_DAY_NEXT, data, token);
};

export const ascDip = async (token) => {
  return await callGet(REQ.DIP.ORDER_BY_ASC, token);
};

export const updateSingleDip = async (data, token) => {
  return await callPutById(
    `${REQ.DIP.UPDATE_SINGLE_DIP}/${data.id}`,
    data,
    token
  );
};

export const viewDip = async (data, token) => {
  return await callPost(REQ.DIP.VIEW_DIP, data, token);
};

export const deleteDip = async (data, token) => {
  return await callDelete(`${REQ.DIP.DELETE_DIP}/${data.date}`, data, token);
};
