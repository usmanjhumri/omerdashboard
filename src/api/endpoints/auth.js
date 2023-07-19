import { callPost, callGet } from "../integrations/calls";
import { REQ } from "../../libs/constants";

export const authVerify = async (token) => {
  return await callGet(REQ.USER.VERIFY, token);
};

export const authLogin = async (data) => {
  return await callPost(REQ.USER.LOGIN, data);
};

export const authRegister = async (data) => {
  return await callPost(REQ.USER.REGISTER, data);
};
