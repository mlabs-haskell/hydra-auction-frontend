export const getUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams;
};
