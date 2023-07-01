import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import useSettings from "../../../../hooks/useSettings";
import useDimension from "../../../../../common/hooks/useDimensions";

const View = () => {
  const { view, update } = useSettings();
  const { up } = useDimension();

  const Bt = ({ type, name }) => (
    <Button
      onClick={() => update("view", type)}
      disableRipple
      variant={view === type ? "contained" : "outlined"}
      children={name}
    />
  );
  return (
    <ButtonGroup
      variant="text"
      orientation={up.sm ? "horizontal" : "vertical"}
      fullWidth={up.sm}
    >
      <Bt type="table" name="Table" />
      <Bt type="calendar" name="Calendar" />
    </ButtonGroup>
  );
};
export default View;
