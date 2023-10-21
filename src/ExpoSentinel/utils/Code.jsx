import Box from "@mui/material/Box";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import IconButton from "../../common/utils/IconButton";

import useToasts from "../../common/hooks/useToast";

export default function Code({ children }) {
  const { push } = useToasts();

  if (children.startsWith("```") && children.endsWith("```")) {
    const real = children.substring(3, children.length - 3);

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
    real.split(/\n/).map((l, i) => {
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
      let ugo = go.substring(0, commStart);

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
          ].includes(_word)
            ? `<span style="color:#00f">${_word + _end}</span>`
            : !isNaN(_word) || ["true", "false"].includes(_word)
            ? `<span style="color:#437700">${_word + _end}</span>`
            : word;
        })
        .join("&nbsp;");

      ch += `<div style="display:flex"><span style="user-select:none;color:#237893">${
        i + 1 + "&nbsp;".repeat(4 - String(i + 1).length)
      }</span><div>${
        !go || go === '<span style="color:#437700"></span>' ? "&nbsp;" : go
      }</div></div>`;
    });
    return (
      <Box
        position="relative"
        sx={{ "&:hover > div": { visibility: "visible" } }}
      >
        <div
          style={{ fontFamily: "Consolas, Courier New, monospace" }}
          dangerouslySetInnerHTML={{
            __html: ch,
          }}
        />
        <Box position="absolute" top={0} right={0} visibility="hidden">
          <IconButton
            onClick={handleCopy}
            Icon={ContentCopyIcon}
            title="Copy code"
            sx={{ bgcolor: "background.paper" }}
          />
        </Box>
      </Box>
    );
  }

  return children;
}
