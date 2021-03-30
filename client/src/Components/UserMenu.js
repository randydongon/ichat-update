import React, { useCallback, useState } from "react";
import { withStyles } from "@material-ui/core/styles";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import MarkunreadOutlinedIcon from "@material-ui/icons/MarkunreadOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import FriendsProfile from "./FriendsProfile";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export default function UserMenu({ anchorEl, setAnchorEl, profile }) {
  const [open, setOpen] = useState(false);

  const handleClose = (e) => {
    e.preventDefault();
    handleSwitch(e.currentTarget.dataset.filter);
    // console.log(e.currentTarget.dataset.filter);
    setAnchorEl(null);
  };

  const handleSwitch = useCallback(
    (data) => {
      switch (data) {
        case "profile":
          setOpen(true);
          break;
        default:
      }
    },
    [setOpen]
  );

  return (
    <div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleClose} data-filter="favorites">
          <ListItemIcon>
            <FavoriteBorderOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add favorites" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose} data-filter="profile">
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="View profile" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose} data-filter="unread">
          <ListItemIcon>
            <MarkunreadOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mark as unread" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose} data-filter="conversation">
          <ListItemIcon>
            <VisibilityOffOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Hide conversation" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose} data-filter="delete">
          <ListItemIcon>
            <DeleteOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete conversation" />
        </StyledMenuItem>
      </StyledMenu>
      <FriendsProfile open={open} setOpen={setOpen} profile={profile} />
    </div>
  );
}
