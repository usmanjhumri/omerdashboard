export const capitalizeString = (text) => {
  return text && text.length > 2
    ? text.charAt(0).toUpperCase() + text.slice(1)
    : "";
};

export const onTimeout = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
