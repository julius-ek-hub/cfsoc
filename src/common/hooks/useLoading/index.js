import { useDispatch, useSelector } from "react-redux";

import { updateLoading } from "../../store/loading";

const useLoading = () => {
  const { loading } = useSelector(({ loading }) => loading);
  const dispatch = useDispatch();

  const update = (value, key = "full") => {
    dispatch(updateLoading({ value, key }));
  };

  return {
    loading,
    update,
  };
};

export default useLoading;
