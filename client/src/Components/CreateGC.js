import React, { useState } from "react";
import "../Components/CreateGroup.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PhotoCameraOutlinedIcon from "@material-ui/icons/PhotoCameraOutlined";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import ArrowForwardOutlinedIcon from "@material-ui/icons/ArrowForwardOutlined";
import { IconButton } from "@material-ui/core";

export default function CreateGC({
  input,
  setInput,
  gimage,
  setGImage,
  setOpenAdd,
}) {
  const [fileUrl, setFileUrl] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  // const [openAdd, setOpenAdd] = useState(false);

  const handleImage = (e) => {
    setGImage(e.target.files[0]);
    setFileUrl(URL.createObjectURL(e.target.files[0]));
  };

  const handleNewGroup = () => {
    setOpenAdd(true);
  };

  return (
    <div>
      <div className="gcmodal__body">
        {gimage ? (
          <div className="gcgroup__image">
            <img
              alt="gcimage"
              src={fileUrl}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              className="gcmodal__avatar"
            />
          </div>
        ) : (
          <div className="gcgroup__image">
            <Tooltip trigger="mouseenter" title="Select group image">
              <label htmlFor="gimage">
                <PhotoCameraOutlinedIcon
                  style={{ fontSize: "3rem", cursor: "pointer" }}
                />
              </label>
            </Tooltip>
            <input
              type="file"
              id="gimage"
              style={{ display: "none" }}
              onChange={handleImage}
            />
          </div>
        )}
        <form className="gcmodal__form">
          <input
            type="text"
            placeholder="Group name"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </form>
      </div>

      <div className="gcmodal__footer">
        {/* <Button autoFocus onClick={handleNewGroup} color="primary">
            Add Group Member
          </Button> */}

        <IconButton
          disabled={input.length > 0 ? false : true}
          onClick={handleNewGroup}
          className="gcsubmit__button"
        >
          <ArrowForwardOutlinedIcon
            className={`${input?.length ? "gcbutton_icon" : "gcbutton__gray"} `}
          />
        </IconButton>
      </div>
      <SimpleMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        setGImage={setGImage}
        setFileUrl={setFileUrl}
      />
    </div>
  );
}

function SimpleMenu({ anchorEl, setAnchorEl, setGImage, setFileUrl }) {
  // const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = () => {
    setGImage(null);
    setFileUrl("");
    setAnchorEl(null);
  };

  return (
    <div className="menu__image">
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleRemove}>Remove image</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
