import ToastNotification from "../../components/toaster/ToastNotification";
import React from "react";
import { toast } from "react-toastify";
import { message } from 'antd'

export const toastError = (message) => {
  return toast.error(
    <ToastNotification message={message} title={"Error"} type={"error"} />
  );
};

export const toastInfo = (message) => {
  return toast.info(
    <ToastNotification message={message} title={"Info"} type={"info"} />
  );
};

export const toastSuccess = (message) => {
  return toast.success(
    <ToastNotification message={message} title={"Success"} type={"success"} />
  );
};

export const toastSystem = (title, message, url) => {
  return toast.info(
    <ToastNotification
      message={message}
      title={title}
      type={"system"}
      url={url}
    />
  );
};

export const toastWarning = (message) => {
  return toast.warning(
    <ToastNotification message={message} title={"Warning"} type={"warn"} />
  );
};


export const AntdMessageError = (msg) => {
  return message.error(msg)
}