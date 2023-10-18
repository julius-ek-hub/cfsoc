import { useDispatch, useSelector } from "react-redux";

import { updateSettings as uset } from "../store/expo-sentinel";

const useSettings = () => {
  const { settings } = useSelector(({ expo_sentinel }) => expo_sentinel);

  const dispatch = useDispatch();

  const updateSettings = (key, value) => dispatch(uset({ key, value }));

  return {
    settings,
    updateSettings,
  };
};

export default useSettings;
