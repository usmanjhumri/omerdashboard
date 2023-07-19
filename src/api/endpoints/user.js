import { callPost } from "../integrations/calls";
import { REQ } from "../../libs/constants";

export const subscribeProduct = async (data, token) => {
  return await callPost(REQ.USER.SUBSCRIBE.PRODUCT, data, token);
};

export const registerUser = async (data) => {
  return await callPost(REQ.USER.REGISTER, data);
};

