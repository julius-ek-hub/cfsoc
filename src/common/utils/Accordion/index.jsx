import MuiAccordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Accordion({ title, TitltIcon, children, no_divider, ...rest }) {
  return (
    <MuiAccordion
      disableGutters
      sx={{
        pl: 1,
        mt: 2,
        "&.MuiPaper-root:before": {
          bgcolor: "transparent",
        },
      }}
      elevation={0}
      {...rest}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 10,
          ...(!no_divider && {
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }),
        }}
      >
        {TitltIcon && <TitltIcon sx={{ mr: 1 }} />} {title}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </MuiAccordion>
  );
}

export default Accordion;
