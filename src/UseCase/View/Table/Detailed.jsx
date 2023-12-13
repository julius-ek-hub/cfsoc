import { useMemo, useState } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import LaunchIcon from "@mui/icons-material/Launch";

import * as Yup from "yup";

import IconButton from "../../../common/utils/IconButton";
import Middle from "../../../common/utils/Middle";
import Draw from "../../utils/Draw";
import DeleteUC from "./Delete";
import EditUC from "./EditUC";
import InDetailedTable from "./InDetailedTable";

import useSheet from "../../hooks/useSheet";

import { _entr, _values, _l } from "../../utils/utils";

const isURL = (url) =>
  Yup.object({ url: Yup.string().url() }).isValidSync({
    url,
  });

const Detailed = ({
  $for = {},
  detail_selected,
  is_uc,
  _key,
  detail_sc,
  TableView,
  selected,
  setSelected,
}) => {
  const { sheets } = useSheet();
  const [drawer, setDrawer] = useState(false);

  const refs = [
    "l1_uc_identifier",
    "l2_uc_identifier",
    "l3_uc_identifier",
    "l4_uc_identifier",
  ];

  const cols_not = [
    "name",
    "identifier",
    "description",
    "l1_uc_identifiers",
    "l2_uc_identifiers",
    "l3_uc_identifiers",
    "l4_uc_identifiers",
  ];

  const id = detail_selected?.identifier?.value;

  const path = [...refs.filter((r) => $for[r]).map((r) => $for[r]), id].join(
    " / "
  );

  const details_selected_sections = useMemo(() => {
    let sections = [];
    if (!detail_selected) return sections;

    _entr(detail_selected).map(([k, v]) => {
      if (!Array.isArray(v)) return;
      let keys = {
        l2s: sheets.l2_uc,
        l3s: sheets.l3_uc,
        l4s: sheets.l4_uc,
        uc: sheets.all_uc,
      };

      const target = keys[k];
      if (!target) return;

      const ref_keys = {
        l1_uc: refs[0],
        l2_uc: refs[1],
        l3_uc: refs[2],
        l4_uc: refs[3],
      };

      sections.push({
        name: target.name,
        $key: target.key,
        content: v,
        $for: {
          ...$for,
          ...(ref_keys[_key] && {
            [ref_keys[_key]]: id,
          }),
        },
      });
    });

    return sections;
  }, [detail_selected]);

  const closeDrawer = () => setDrawer(false);

  if (!detail_selected) return null;

  const L = ({ href, text, sep }) => (
    <>
      <Link
        href={href}
        target="_blank"
        underline="hover"
        sx={{ wordBreak: "break-word" }}
        color={(t) => `${t.palette.primary.main}!important`}
      >
        {text}
        <LaunchIcon sx={{ fontSize: "15px", ml: 0.2 }} />
      </Link>
      {sep}
    </>
  );

  return (
    <Box display="flex" px={1}>
      <Draw
        open={drawer}
        onXclose={closeDrawer}
        onClose={closeDrawer}
        Okbutton={() => <EditUC edit={selected[0]} $for={$for} />}
        path={path}
        title={
          <>
            {detail_selected.identifier.value || "N/A"} &mdash;{" "}
            {detail_selected.name.value}
          </>
        }
      >
        <Typography>{detail_selected.description?.value}</Typography>
        <Box mt={2}>
          {detail_sc
            .filter(([k]) => !cols_not.includes(k))
            .map(([k, v]) => {
              const val = String(detail_selected[k]?.value || "")
                .split(",")
                .map((w, i, a) => {
                  const tech_url = "https://attack.mitre.org/techniques/";
                  const word = w.trim();
                  const tac = word.match(/TA[0-9]+/);
                  const stec = word.match(/T[0-9]+\/[0-9]+/);
                  const stec2 = word.match(/T[0-9]+\.[0-9]+/);
                  const tec = word.match(/T[0-9]+/);
                  const url = isURL(word);
                  let h;
                  if (tac) h = `https://attack.mitre.org/tactics/${tac[0]}`;
                  else if (stec) h = tech_url + stec[0];
                  else if (stec2) h = tech_url + stec2[0].split(".").join("/");
                  else if (tec) h = tech_url + tec[0];
                  else if (word && url) h = word;

                  if (h)
                    return (
                      <L
                        key={i}
                        href={h}
                        text={word}
                        sep={i === a.length - 1 ? "" : ", "}
                      />
                    );
                  return (
                    <Box key={i} component="span">
                      {word || "N/A"}
                    </Box>
                  );
                });

              return (
                <Box key={k}>
                  <Typography
                    sx={{
                      display: "inline",
                      mt: 1,
                      fontWeight: "bold",
                    }}
                  >
                    {v.label}:
                  </Typography>
                  <Typography
                    sx={{
                      display: "inline",
                      mt: 1,
                      ml: 1,
                    }}
                  >
                    {val.length == 0 ? "N/A" : val}
                  </Typography>
                </Box>
              );
            })}
        </Box>
        {[
          ...details_selected_sections.filter((dss) => dss.$key !== "all_uc"),
          ...details_selected_sections.filter((dss) => dss.$key === "all_uc"),
        ].map((dss) => (
          <InDetailedTable
            TableView={TableView}
            {...dss}
            key={dss.$key}
            path={path}
          />
        ))}
      </Draw>
      <Middle justifyContent="start" gap={4}>
        <IconButton
          onClick={() => setDrawer(true)}
          Icon={KeyboardDoubleArrowLeftIcon}
          title="Show details"
        />
        {is_uc && (
          <>
            {selected.length === 1 && <EditUC edit={selected[0]} $for={$for} />}
            <DeleteUC selected={selected} onDelete={() => setSelected([])} />
          </>
        )}
      </Middle>
    </Box>
  );
};

export default Detailed;
