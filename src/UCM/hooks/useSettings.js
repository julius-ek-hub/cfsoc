import { useDispatch, useSelector } from "react-redux";

import { updateSettings as uset } from "../store/ucm";

const useSettings = () => {
  const { settings } = useSelector(({ ucm }) => ucm);

  const dispatch = useDispatch();

  const updateSettings = (key, value) => dispatch(uset({ key, value }));

  return {
    settings,
    updateSettings,
  };
};

export default useSettings;
