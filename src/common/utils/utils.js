export const u = (str) => str[0].toUpperCase() + str.substring(1);
export const sleep = (time = 1000) =>
  new Promise((res) => setTimeout(res, time));
