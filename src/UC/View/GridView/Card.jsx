import { useEffect, useState } from "react";

import { lighten } from "@mui/material/styles";

import MuiCard from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useSheet from "../../hooks/useSheet";

import Drawer from "./Drawer";
import Loading from "./Loading";

const Card = ({ name = "", footerGetter, iKey, iValue, $for, description }) => {
  const [lInfo, setLinfo] = useState({
    uc: [],
    footer: null,
    loading: true,
  });
  const { contents } = useSheet();

  const uc_len = lInfo.uc.length;

  const alpha = uc_len === 0 ? 0 : uc_len < 5 ? 0.8 : uc_len < 10 ? 0.4 : 1;

  useEffect(() => {
    if (contents) {
      const footer = footerGetter(contents);
      const uc = contents.all_uc.filter((uc) =>
        (uc[iKey]?.value || []).includes(iValue)
      );

      setLinfo({
        ...lInfo,
        footer,
        loading: false,
        uc,
      });
    }
  }, [contents]);

  if (lInfo.loading) return <Loading />;

  return (
    <Drawer
      description={description}
      name={name}
      identifier={iValue}
      uc={lInfo.uc}
      $for={$for}
      Initiator={(props) => (
        <Box {...props}>
          <MuiCard
            title={name}
            variant="outlined"
            sx={{
              flexShrink: 0,
              height: 150,
              minWidth: 150,
              cursor: "pointer",
              position: "relative",
              ...(alpha > 0 && {
                bgcolor: (t) =>
                  lighten(t.palette.primary.main, alpha === 1 ? 0 : alpha),
                color: alpha === 0.8 ? "common.black" : "common.white",
              }),
            }}
          >
            <CardContent sx={{ pb: 0 }}>
              <Typography fontWeight="bolder">{uc_len}</Typography>
              <Typography>{`${name.substring(0, 20)}${
                name.length > 20 ? "..." : ""
              }`}</Typography>
            </CardContent>
            <CardActions
              sx={{
                fontSize: "small",
                mt: "auto",
                position: "absolute",
                bottom: 0,
                left: "8px",
                backgroundColor: "inherit",
              }}
            >
              {lInfo.footer}
            </CardActions>
          </MuiCard>
        </Box>
      )}
    />
  );
};

export default Card;
