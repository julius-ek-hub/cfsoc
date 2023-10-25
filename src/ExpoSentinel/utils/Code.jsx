import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import IconButton from "../../common/utils/IconButton";
import Confirm from "../../common/utils/Comfirm";
import Middle from "../../common/utils/Middle";

import useToasts from "../../common/hooks/useToast";

const __match = (word, exp) =>
  word.match(new RegExp(`[(),;*=]${exp}[(),;*=]?`)) ||
  word.match(new RegExp(`[(),;*=]?${exp}[(),;*=]`));

const key_words = [
  "where",
  "summarize",
  "by",
  "datetime",
  "and",
  "or",
  "extend",
  "join",
  "lookup",
  "project",
  "project-rename",
  "on",
  "has",
  "between",
  "includes",
  "count",
  "mv-apply",
  "sartswith",
  "union",
  "string",
  "real",
  "contains",
  "let",
  "const",
  "var",
  "function",
  "import",
  "table",
];

const Cell = ({
  toolbar_extras,
  for_cell,
  for_dialog,
  show_dialog,
  title,
  maxWidth,
}) => (
  <Box
    maxHeight={600}
    overflow="hidden"
    position="relative"
    maxWidth={maxWidth}
  >
    {for_cell}
    {show_dialog && (
      <Confirm
        ok_text="Close"
        onClick={(e) => e.stopPropagation()}
        title={title}
        is_alert
        expandable
        fullScreen
        toolbar_extras={toolbar_extras}
        Clickable={(props) => (
          <Middle
            height={100}
            position="absolute"
            bottom={0}
            width="100%"
            display="flex"
            justifyContent="end"
            title="Click to View full cell..."
            sx={{
              backgroundImage: (t) =>
                `linear-gradient(transparent, ${t.palette.background.paper})`,
            }}
          >
            <Button {...props}>Show complete...</Button>
          </Middle>
        )}
      >
        {for_dialog}
      </Confirm>
    )}
  </Box>
);

export default function Code({
  children,
  has_selected,
  ordered,
  search,
  columnName,
}) {
  const { push } = useToasts();

  const t = useTheme();

  const maxWidth = `calc(100vw - ${
    55 + (has_selected ? 85 : 0) + (ordered ? 60 : 0)
  }px);`;

  let __chi = children.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");

  search &&
    search.map((spv) => {
      const _go = spv.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const _spv = spv.replace(/[\[\]]/g, "");
      __chi = __chi.replace(
        new RegExp(_spv.replace(/</g, "&lt;").replace(/>/g, "&gt;"), "ig"),
        `---ss---${_go}---se---`
      );
    });

  const highlightSearch = (val) =>
    val
      .replace(/---ss---/g, `<span style="background-color:yellow">`)
      .replace(/---se---/g, `</span>`);

  if (__chi.startsWith("```") && __chi.endsWith("```")) {
    const real = __chi.substring(3, __chi.length - 3);

    const handleCopy = async () => {
      const copied = () =>
        push({ message: "Code copied to clipboard", severity: "success" });
      const failed = () =>
        push({
          message:
            "Failed to copy Code to clipboard, manually select and copy.",
          severity: "success",
        });
      try {
        await window.navigator.clipboard.writeText(real);
        copied();
      } catch (error) {
        let ta = document.createElement("textarea");
        ta.value = real;
        document.body.appendChild(ta);
        ta.select();
        try {
          if (document.execCommand("copy")) copied();
          else failed();
        } catch (error) {
          failed();
        } finally {
          ta.remove();
        }
      }
    };

    let ch = "";
    let lines = 0;
    real.split(/\n/).map((l, i, arr) => {
      let go = l.replace(/ /g, "&nbsp;");
      let ind = l.indexOf("//");

      if (
        ind !== -1 &&
        !(
          ind !== 0 &&
          ["http:", "https:"].some((h) => l.split("//")[0].endsWith(h))
        )
      ) {
        let com = l.split("");
        com[ind] = '<span style="color:#437700">/';
        com = com.join("");
        com += "</span>";
        go = com;
      } else ind = -1;

      const commStart = ind !== -1 ? ind : go.length;
      let ugo = go
        .substring(0, commStart)
        .replace(/ /g, "&nbsp;")
        .replace(/\t/g, "&nbsp;".repeat(4));

      const reg = ugo.matchAll(/["'`](.*?)["'`]/g);
      [...reg].map((re) => {
        if (re[0].trim())
          ugo = ugo.replaceAll(
            re[0],
            `<span style="color:#B22222">${re[0]}</span>`
          );
      });

      go = (ugo + go.substring(commStart))
        .split("&nbsp;")
        .map((word) => {
          let _w = word;
          key_words.map((kw) => {
            if (kw === word || __match(word, kw))
              _w = _w.replace(kw, `<span style="color:#0096FF">${kw}</span>`);
          });

          const bool = __match(
            word,
            "(([0-9]+([-+*/])?[0-9]+(([-+*/])?[0-9]+)?)|true|false)"
          );

          if (bool)
            _w = _w.replace(
              bool[2],
              `<span style="color:#437700">${bool[2]}</span>`
            );

          return _w;
        })
        .join("&nbsp;");

      const snLen = String(i + 1).length;

      ch += `<div style="display:flex"><span style="user-select:none;color:#237893;border-right:1px solid ${
        arr.length > 999 ? "transparent" : t.palette.divider
      }">${
        i + 1 + "&nbsp;".repeat(arr.length > 999 ? 0 : 4 - snLen)
      }</span><div style="margin-left:10px">${
        !go || go === '<span style="color:#437700"></span>' ? "&nbsp;" : go
      }</div></div>`;
      lines++;
    });

    const codeProps = {
      sx: {
        fontFamily: "Consolas, Courier New, monospace",
      },
      dangerouslySetInnerHTML: {
        __html: highlightSearch(ch),
      },
    };

    const codeCell = (
      <Box
        {...codeProps}
        sx={{ ...codeProps.sx, maxWidth, overflow: "auto" }}
      />
    );
    const codeDialog = <Box {...codeProps} />;

    const copyButton = (
      <IconButton
        onClick={handleCopy}
        Icon={ContentCopyIcon}
        title="Copy code"
      />
    );

    return (
      <Box
        position="relative"
        sx={{
          "&:hover > div": { visibility: "visible" },
          overflow: "hidden",
        }}
      >
        <Cell
          for_cell={codeCell}
          for_dialog={codeDialog}
          toolbar_extras={copyButton}
          show_dialog={lines >= 30}
          title={columnName}
          maxWidth={maxWidth}
        />
        <Box position="absolute" top={0} right={0} visibility="hidden">
          {copyButton}
        </Box>
      </Box>
    );
  }

  const forBoth = (
    <Box
      maxWidth={maxWidth}
      dangerouslySetInnerHTML={{
        __html: highlightSearch(
          __chi
            .replace(/\n/g, "<br/>")
            .replace(/ /g, "&nbsp;")
            .replace(/\t/g, "&nbsp;".repeat(4))
        ),
      }}
    />
  );

  return (
    <Cell
      for_cell={forBoth}
      for_dialog={forBoth}
      show_dialog={__chi.split(/\n/).length > 20 || __chi.length > 5000}
      title={columnName}
      maxWidth={maxWidth}
    />
  );
}
