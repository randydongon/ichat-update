import React, { useState, useEffect, useCallback, forwardRef } from "react";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {
  ListItem,
  ListItemText,
  List,
  IconButton,
  FormControl,
} from "@material-ui/core";
import AddFriend from "./AddFriend";
import { MoreVertOutlined } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import "../Components/SearchUser.css";
import axios from "axios";

const API = process.env.REACT_APP_API;

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
  root: {
    display: "flex",
    top: "12vh !important",
    paddingRight: "1ch",
    paddingLeft: "1ch",
  },
  renderuserdiv: {
    borderBottom: "1px solid #eee",
    padding: "0ch 2ch",
    textAlign: "center",
  },
  moreIcon: {
    display: "none",
    width: "fit-content",
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #bbb",
  },
  render__form: {
    display: "felx",
    flexDirection: "row",
  },
  render__formcontrol: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  render__button: {
    flex: 0,
  },
  searchuser_header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,

    boxSizing: "border-box",
    margin: "0 0.1rem",
  },
  input__search: {
    display: "flex",
    flex: 1,
    width: "100%",
    outline: "none",
    border: "1px solid #eee",
    borderRadius: "1rem",
    fontSize: "1.1rem",
    padding: "0.3rem 0.9rem",
  },
  member__listitem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "0.5rem",
    marginLeft: "0.5rem",
  },
  member__div: {
    width: "3rem",
    height: "3rem",
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    padding: 0,
  },
}));

const SearchUser = forwardRef(({ setRequest }, ref) => {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState([]);
  const [userItem, setUserItem] = useState({});
  const handleClose = (e) => {
    e.preventDefault();
    setRequest(false);
  };

  const searchProfile = useCallback(async () => {
    const resp = await fetch(`${API}/searchfriend/${input}`);
    const data = await resp.json();
    const currentuser = localStorage.getItem("currentuser");
    if (currentuser == null) return;
    const user = JSON.parse(currentuser);
    const newData = data.filter(
      (doc) => doc._id !== user.id && doc._id.split(":")[0] !== "19"
    );

    setProfile(
      newData.map((doc) => ({
        name: doc.user_name,
        id: doc._id,
        email: doc.email,
        imageid: doc.imageid,
      }))
    );
  }, [input]);

  useEffect(() => {
    searchProfile();
  }, [input, searchProfile]);

  const handleChageInput = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div ref={ref}>
      <div className={classes.searchuser_header}>
        <form onSubmit={handleSubmit} className={classes.searchuser_header}>
          <FormControl className={classes.searchuser_header}>
            <input
              type="text"
              name="input"
              value={input}
              onChange={handleChageInput}
              className={classes.input__search}
              placeholder="Search a friend"
              autoFocus
            />
            <IconButton
              variant="outlined"
              color="primary"
              onClick={handleClose}
              type="submit"
            >
              <CloseIcon />
            </IconButton>
          </FormControl>
        </form>
      </div>
      <List className="list__renderuser">
        {profile?.length > 0
          ? profile?.map((item, index) => (
              <RenderMember
                key={index}
                item={item}
                setUserItem={setUserItem}
                setAnchorEl={setAnchorEl}
              />
            ))
          : null}
      </List>

      <AddFriend
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        userItem={userItem}
      />
    </div>
  );
});

export default SearchUser;

//display lists of profile
const RenderMember = ({ item, setUserItem, setAnchorEl }) => {
  const classes = useStyles();
  const [imageFile, setImageFile] = useState({});

  const handleListItemClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleAnchorEl = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleMouseEnter = (id) => {
    document.getElementById(id).style.display = "block";
  };
  const handleMouseLeave = (id) => {
    document.getElementById(id).style.display = "none";
  };

  const handleSearchProfile = useCallback(() => {
    axios
      .get(`${API}/uploadfile/${item.imageid}`)
      .then((resp) => {
        setImageFile({
          file: resp.data?.file,
          filename: resp.data?.filename,
          contenttype: resp.data?.contenttype,
        });
      })
      .catch((error) => console.log("Error:", error));
  }, [item.imageid]);

  useEffect(() => {
    handleSearchProfile();
  }, [item.imageid, handleSearchProfile]);

  return (
    <div
      onMouseLeave={() => handleMouseLeave(item?.id)}
      style={{ display: "flex" }}
    >
      <ListItem
        data-item="chat"
        className={classes.member__listitem}
        button
        onMouseEnter={() => handleMouseEnter(item?.id)}
      >
        <div
          style={{ display: "flex", alignItems: "center" }}
          onClick={handleListItemClick}
        >
          <ListItemAvatar>
            <Avatar
              src={
                imageFile?.file
                  ? `data:${imageFile?.contenttype};base64, ${imageFile?.file}`
                  : "https://picsum.photos/200/300?random=1"
              }
              alt="pic"
              className={classes.avatar}
            />
          </ListItemAvatar>
          <ListItemText primary={item?.name} />
        </div>
        <div className={classes.member__div}>
          <IconButton
            id={item.id}
            onMouseEnter={() => setUserItem(item)}
            onClick={(e) => handleAnchorEl(e)}
            className={classes.moreIcon}
          >
            <MoreVertOutlined style={{ width: "1.3rem", height: "1.3rem" }} />
          </IconButton>
        </div>
      </ListItem>
    </div>
  );
};
