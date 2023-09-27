import { useSearchParams } from "react-router-dom";

const useUI = () => {
  const [sp, setSP] = useSearchParams();

  let ui = sp.get("ui");
  const allowed = ["json", "table"].includes(ui);

  const setUI = (_ui) => setSP({ ui: _ui });
  return {
    ui,
    allowed,
    setUI,
  };
};

export default useUI;
