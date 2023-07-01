import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { darken } from "@mui/material/styles";

import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import Refresh from "@mui/icons-material/Refresh";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import DownloadIcon from "@mui/icons-material/Download";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import WarningIcon from "@mui/icons-material/Warning";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

import IconButton from "../../../common/utils/IconButton";
import Confirm from "../../../common/utils/Comfirm";
import Editor from "./Editor";
import WithSuggested from "./WithSuggesters";
import EmailSchedule from "./EmailSchedule";

import useActiveSchedule from "../../hooks/useSchedules/active";
import useCommonSettings from "../../../common/hooks/useSettings";
import useSettings from "../../hooks/useSettings";

import { schedule_date_range_ui } from "../../utils/utils";
import { u } from "../../../common/utils/utils";

const PrimaryBar = (props) => (
  <Box
    color="common.white"
    bgcolor={(t) =>
      t.palette.mode === "light"
        ? "primary.main"
        : darken(t.palette.background.paper, 0.5)
    }
    p={1}
    {...props}
  />
);

const SpaceBetween = (props) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    {...props}
  />
);

const ToolBar = () => {
  const {
    active,
    active_by,
    historyLevel,
    history,
    downloadSchedule,
    saveSchedule,
    loadSchedule,
    update_like,
    remSchedule,
    may_create_own,
    generateSchedule,
    setHistory,
    update_lock,
    approve_suggestion,
  } = useActiveSchedule();

  const { update, show_profile } = useSettings();
  const { uname, guest, admin, getName } = useCommonSettings();

  const menuButton = (
    <IconButton
      Icon={MenuOpenIcon}
      title="Menu"
      onClick={() =>
        update("show_profile", show_profile === "true" ? "false" : "true")
      }
    />
  );

  if (!active || active?.error || active?.suggestions[active_by]?.error)
    return <PrimaryBar>{menuButton}</PrimaryBar>;

  const mine = active_by === uname;
  const d = schedule_date_range_ui(active.from, active.to);
  const ass = active.suggestions[active_by];
  const votes = ass?.votes || [];
  const approved = ass?.approved;
  const liked_this = votes.includes(uname);
  const has_approved = Object.values(active.suggestions).some(
    (s) => s.approved
  );
  const locked = active.locked || has_approved;

  const deleteButton = (mine || admin) && (
    <Confirm
      ok_color="error"
      ok_text="Delete"
      Clickable={(props) => (
        <IconButton Icon={DeleteIcon} title="Delete" {...props} />
      )}
      onConfirm={remSchedule}
    >
      Are you sure you want to delete{" "}
      {mine
        ? "your"
        : (active_by === "sys" ? "SYSTEM" : getName(active_by).split(" ")[0]) +
          "'s"}{" "}
      suggestion?
      {Object.keys(active.suggestions).length === 1 && (
        <Typography
          color="error"
          sx={{
            wordBreak: "normal",
            mt: 2,
            display: "flex",
          }}
        >
          <WarningIcon color="error" fontSize="small" sx={{ mr: 0.2 }} />
          This is the only suggestion, deleting it will delete the entire
          schedule.
        </Typography>
      )}
    </Confirm>
  );

  const saveButton = !guest && !locked && (
    <IconButton Icon={SaveIcon} onClick={saveSchedule} title="Save" />
  );

  const downloadButton = (
    <WithSuggested
      okText="Download"
      Icon={DownloadIcon}
      onChoose={downloadSchedule}
      title="Download Schedule"
    />
  );
  const refreshButton = (
    <IconButton Icon={Refresh} onClick={loadSchedule} title="Refresh" />
  );
  const approve = admin && (approved || !has_approved) && (
    <Confirm
      ok_color={approved ? "error" : "primary"}
      ok_text={approved ? "Unapprove" : "Approve"}
      title={(approved ? "Unapprove" : "Approve") + " suggetion?"}
      Clickable={(props) => (
        <IconButton
          Icon={approved ? VerifiedUserIcon : VerifiedUserOutlinedIcon}
          title={approved ? "Unapprove" : "Approve"}
          {...props}
        />
      )}
      onConfirm={approve_suggestion}
    >
      This will {approved ? "unapprove" : "forcefully approve"} this suggestion{" "}
      {approved
        ? ""
        : "even if it has the least vote. The Entire schedule will then be locked."}
      <Typography color="text.secondary" mt={1}>
        *All admins can reverse this action.
      </Typography>
    </Confirm>
  );

  const copyButton = may_create_own() && (
    <IconButton
      Icon={ContentCopyIcon}
      onClick={() => generateSchedule(true)}
      title="Create Copy"
    />
  );

  const likeButton = !guest && (
    <IconButton
      Icon={liked_this ? FavoriteIcon : FavoriteBorderIcon}
      title={
        mine || active?.suggestions[uname]
          ? "Can't perform this action"
          : liked_this
          ? "Unlike"
          : "Like"
      }
      disabled={Boolean(mine || active?.suggestions[uname])}
      onClick={update_like}
    />
  );
  const send = !guest && <EmailSchedule />;
  const lock = admin && (
    <Confirm
      ok_color={locked ? "primary" : "error"}
      ok_text={locked ? "Unlock" : "Lock"}
      title={(locked ? "Unlock" : "Lock") + " schedule?"}
      Clickable={(props) => (
        <IconButton
          disabled={Boolean(has_approved)}
          Icon={locked ? LockIcon : LockOpenIcon}
          title={
            has_approved
              ? "Can't perform this action"
              : locked
              ? "Unlock Schedule"
              : "Lock schedule"
          }
          {...props}
        />
      )}
      onConfirm={() => !has_approved && update_lock()}
    >
      Staffs will {locked ? "now" : "not"} be able to make changes on the
      schedule.
      <Typography color="text.secondary" mt={1}>
        *All admins can reverse this action.
      </Typography>
    </Confirm>
  );

  const undo = !guest && historyLevel > 0 && (
    <IconButton Icon={UndoIcon} title="Undo" onClick={() => setHistory(-1)} />
  );
  const redo = !guest && historyLevel < history.length - 1 && (
    <IconButton Icon={RedoIcon} title="Redo" onClick={() => setHistory(1)} />
  );

  const likersGroup = (
    <AvatarGroup
      sx={{
        ".MuiAvatar-root": { height: 20, width: 20, fontSize: 10 },
      }}
    >
      {votes.map((staff) => {
        const n = staff.split(".").map(u).join(" ");
        return (
          <Tooltip
            key={staff}
            title={staff === uname ? "You" : staff === "sys" ? "SYSTEM" : n}
          >
            <Avatar alt={n}>
              {n
                .split(" ")
                .map((_n) => _n[0])
                .join("")}
            </Avatar>
          </Tooltip>
        );
      })}
    </AvatarGroup>
  );

  const title = (
    <Box
      sx={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        flexGrow: 1,
        textAlign: "center",
      }}
    >
      {active.from && (
        <>
          SOC Schedule {`(` + d[0]} &#8212; {d[1] + `).xlsx`}
          {(locked || !mine) && " [Read-Only]"}
        </>
      )}
    </Box>
  );

  return (
    <PrimaryBar>
      <SpaceBetween>
        {menuButton}
        {saveButton}
        {undo}
        {redo}
        {title}
      </SpaceBetween>
      <Divider />
      <SpaceBetween>
        <Stack direction="row" alignItems="center" overflow="auto">
          {refreshButton}
          {downloadButton}
          {send}
          {lock}
          {locked && !admin && (
            <IconButton Icon={LockIcon} title="Locked, can't edit" disabled />
          )}
          {!locked && (
            <>
              {copyButton}
              {deleteButton}
              {likeButton}
            </>
          )}
          {approve}
        </Stack>
        {likersGroup}
        <Editor />
      </SpaceBetween>
    </PrimaryBar>
  );
};

export default ToolBar;
