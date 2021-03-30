import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";

import MarkunreadOutlinedIcon from "@material-ui/icons/MarkunreadOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import ManageGroup from "./ManageGroup";

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

export default function GroupChatMenu({ anchorEl, setAnchorEl, groupChat }) {
  //   const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);

  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenItem = (e) => {
    const data = e.currentTarget.dataset.filter;
    console.log(data);
    switch (data) {
      case "managegroup":
        setOpen(true);
        break;
      default:
    }
  };

  return (
    <div>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleOpenItem} data-filter="favorites">
          <ListItemIcon>
            <FavoriteBorderOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Add favorites" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleOpenItem} data-filter="managegroup">
          <ListItemIcon>
            <PeopleAltOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Manage group" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleOpenItem} data-filter="unread">
          <ListItemIcon>
            <MarkunreadOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mark as unread" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleOpenItem} data-filter="conversation">
          <ListItemIcon>
            <VisibilityOffOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Hide conversation" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleOpenItem} data-filter="delete">
          <ListItemIcon>
            <DeleteOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete conversation" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleOpenItem} data-filter="leave">
          <ListItemIcon>
            <ExitToAppOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Leave group" />
        </StyledMenuItem>
      </StyledMenu>

      {open ? (
        <ManageGroup open={open} setOpen={setOpen} groupChat={groupChat} />
      ) : null}
    </div>
  );
}
