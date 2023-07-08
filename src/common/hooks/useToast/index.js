import { useDispatch, useSelector } from "react-redux";

import { push as p, shift as s } from "../../store/toasts";

const useToasts = () => {
  const { toasts } = useSelector(({ toasts }) => toasts);
  const dispatch = useDispatch();

  const push = (value) => dispatch(p(value));
  const shift = () => dispatch(s());

  return { toasts, push, shift };
};

export default useToasts;
