import React from "react";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useLogout } from "../context/LogoutProvider";

export default function ProfileMenu({
  anchorEl,
  setAnchorEl,
  setOpen,
  setOpenGroup,
}) {
  const { userLogOut } = useLogout();
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    userLogOut();
    localStorage.clear();
  };

  return (
    <div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => setOpen(true)}>View Profile</MenuItem>
        <MenuItem onClick={() => setOpenGroup(true)}>Create Group</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
