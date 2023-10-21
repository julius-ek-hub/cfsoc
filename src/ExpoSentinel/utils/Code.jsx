import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import IconButton from "../../common/utils/IconButton";
import Confirm from "../../common/utils/Comfirm";

import useToasts from "../../common/hooks/useToast";

export default function Code({ children, has_selected, ordered }) {
  const { push } = useToasts();

  const t = useTheme();

  const maxWidth = `calc(100vw - ${
    40 + (has_selected ? 80 : 0) + (ordered ? 60 : 0)
  }px);`;

  const __chi = children.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
          let _word = word;
          let _end = "";
          if (_word.endsWith(";")) {
            _word = _word.substring(0, _word.length - 1);
            _end = ";";
          }
          return [
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
          ].includes(_word)
            ? `<span style="color:#0096FF">${_word + _end}</span>`
            : !isNaN(_word) || ["true", "false"].includes(_word)
            ? `<span style="color:#437700">${_word + _end}</span>`
            : word;
        })
        .join("&nbsp;");

      const snLen = String(i + 1).length;

      ch += `<div style="display:flex" onfocus="alert(90)"><span style="user-select:none;color:#237893;border-right:1px solid ${
        arr.length > 999 ? "transparent" : t.palette.divider
      }">${
        i + 1 + "&nbsp;".repeat(arr.length > 999 ? 0 : 4 - snLen)
      }</span><div style="margin-left:10px">${
        !go || go === '<span style="color:#437700"></span>' ? "&nbsp;" : go
      }</div></div>`;
      lines++;
    });

    const __code = (
      <Box
        sx={{
          fontFamily: "Consolas, Courier New, monospace",
          maxWidth,
          overflow: "auto",
        }}
        dangerouslySetInnerHTML={{
          __html: ch,
        }}
      />
    );

    const copyButton = (
      <IconButton
        onClick={handleCopy}
        Icon={ContentCopyIcon}
        title="Copy code"
        sx={{ bgcolor: "background.paper" }}
      />
    );

    return (
      <Box
        position="relative"
        sx={{
          "&:hover > div": { visibility: "visible" },
          maxWidth,
          overflow: "hidden",
        }}
      >
        <Box maxHeight={200} overflow="hidden">
          {__code}
        </Box>
        {lines > 10 && (
          <Confirm
            ok_text="Close"
            onClick={(e) => e.stopPropagation()}
            title="Query"
            is_alert
            expandable
            toolbar_extras={copyButton}
            Clickable={(props) => (
              <Button sx={{ mt: 1 }} {...props}>
                View full query...
              </Button>
            )}
          >
            {__code}
          </Confirm>
        )}

        <Box position="absolute" top={0} right={0} visibility="hidden">
          {copyButton}
        </Box>
      </Box>
    );
  }

  return __chi;
}
