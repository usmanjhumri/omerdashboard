import { callGet, callPost, callDelete, callPut } from "../integrations/calls";
import { REQ } from "../../libs/constants";


export const saveData = async (data, token) => {
  return await callPost(REQ.OPENING_BALENCE_STOCK.SAVE_DATA, data, token);
};

export const getDate = async (token) => {
  return await callGet(REQ.OPENING_BALENCE_STOCK.GET_DATE, token);
};

export const getData = async (token) => {
  return await callGet(REQ.OPENING_BALENCE_STOCK.GET_DATA, token);
};

export const updateBalence = async (data, token) => {
  return await callPut(
    `${REQ.OPENING_BALENCE_STOCK.UPDATE_OPENING}/${data.id}`,
    data,
    token
  );
};

export const deleteSingle = async (id, token) => {
  return await callDelete(
    `${REQ.OPENING_BALENCE_STOCK.DELETE_SINGLE_BAL}/${id}`,
    {},
    token
  );
};

export const deleteWholeBal = async (token) => {
  return await callDelete(REQ.OPENING_BALENCE_STOCK.DELETE_WHOLE, {}, token);
};
