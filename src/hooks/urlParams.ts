import { useLocation } from "react-router-dom";

export const useUrlParams = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  return urlParams;
};
