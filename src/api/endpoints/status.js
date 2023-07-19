import { callGet } from "../../api/integrations/calls";
import { REQ } from "../../libs/constants";

export const statusApi = async () => {
  return await callGet(REQ.STATUS);
};
