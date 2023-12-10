import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

import Draw from "../../utils/Draw";

const InDetailedTable = ({
  $for = {},
  $key,
  TableView,
  content,
  name,
  path,
}) => {
  const [showFull, setShowFull] = useState(false);
  const [filter, setFilter] = useState("*");

  const handleClose = () => setShowFull(false);

  const _content =
    filter === "*"
      ? content
      : content.filter((c) => c[filter]?.value?.length > 0);

  const title = `${name} (${content.length})`;

  const filters = [
    { label: "All", key: "*" },
    {
      label: "#L2 UC Related",
      key: "l2_uc_identifiers",
    },
    {
      label: "#L3 UC Related",
      key: "l3_uc_identifiers",
    },
    {
      label: "#L4 UC Related",
      key: "l4_uc_identifiers",
    },
  ];
  const getFilters = (except = []) =>
    [...filters].filter((f, i) => !except.includes(i));

  let filter_buttons, which;

  if ($key === "all_uc" && !$for.l4_uc_identifier) {
    if ($for.l1_uc_identifier) filter_buttons = getFilters();
    if ($for.l2_uc_identifier) filter_buttons = getFilters([1]);
    if ($for.l3_uc_identifier) filter_buttons = getFilters([1, 2]);

    which = filter_buttons && (
      <Stack sx={{ mb: 2 }} direction="row" gap={1}>
        {filter_buttons.map((fb) => (
          <Chip
            key={fb.label}
            label={fb.label}
            onClick={() => setFilter(fb.key)}
            variant={filter === fb.key ? "filled" : "outlined"}
            color="primary"
          />
        ))}
      </Stack>
    );
  }

  useEffect(() => {
    setFilter("*");
  }, []);

  return (
    <Box mt={2}>
      <Typography variant="h5" py={2}>
        {title}
      </Typography>

      {which}
      <Box>
        <TableView
          use={_content.slice(0, 4)}
          useKey={$key}
          $for={$for}
          {...(_content.length > 4 && {
            dataEndTable: (
              <Button color="inherit" onClick={() => setShowFull(true)}>
                Show All {_content.length} {name}
              </Button>
            ),
          })}
        />
      </Box>
      <Draw
        title={title}
        open={showFull}
        fullScreen
        onClose={handleClose}
        onXClose={handleClose}
        path={path}
        description={which}
      >
        <TableView use={_content} useKey={$key} $for={$for} />
      </Draw>
    </Box>
  );
};

export default InDetailedTable;
