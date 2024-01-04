import { useDispatch, useSelector } from "react-redux";

import { updateSettings as uset } from "../store/kp";

const useSettings = () => {
  const { settings } = useSelector(({ pkeepass }) => pkeepass);

  const dispatch = useDispatch();

  const updateSettings = (key, value) => dispatch(uset({ key, value }));

  return {
    settings,
    updateSettings,
  };
};

export default useSettings;
