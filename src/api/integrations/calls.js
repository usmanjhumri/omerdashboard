import { parseError } from "../integrations/errors";
import axios from "axios";

export const callEndpoint = async (url, method, data, token) => {

  const headers = {
    "Access-Control-Allow-Origin": "*",
    accept: "application/json",
    audience: window.location.origin,
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await axios({
    url: url,
    method: method,
    data: data,
    headers: headers,
  })
    .then((res) => res.data)
    .catch((error) => parseError(error?.response?.data?.message));

  return res;
};

export const callDelete = async (url, data, token) => {
  return callEndpoint(url, "delete", data, token);
};

export const callGet = async (url, token) => {
  return callEndpoint(url, "get", {}, token);
};

export const callPost = async (url, data, token) => {
  console.log({ token }, 'tokn')
  return callEndpoint(url, "post", data, token);
};

export const callPutById = async (url, data, token) => {
  console.log({ token }, 'tokn')
  return callEndpoint(url, "put", data, token);
};

export const callPut = async (url, data, token) => {
  return callEndpoint(url, "put", data, token);
};
