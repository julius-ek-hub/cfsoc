import { useDispatch, useSelector } from "react-redux";

import { updateSettings as uset } from "../store/expo-sentinel";

import useLocalStorage from "../../common/hooks/useLocalStorage";

const useSettings = () => {
  const { settings } = useSelector(({ expo_sentinel }) => expo_sentinel);
  const { set } = useLocalStorage();

  const dispatch = useDispatch();

  const updateSettings = (key, value) => {
    dispatch(uset({ key, value }));
    set(key, value);
  };

  return {
    settings,
    updateSettings,
  };
};

export default useSettings;
