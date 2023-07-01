import Middle from "../../../common/utils/Middle";

const EmptyCell = ({ sx, ...rest }) => {
  return (
    <Middle
      sx={{
        border: (t) => `1px solid ${t.palette.divider}`,
        height: 60,
        ...sx,
      }}
      {...rest}
    />
  );
};

export default EmptyCell;
