import React, { useCallback, useState, useEffect } from "react";
import "../Components/RenderUser.css";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {
  ListItem,
  ListItemText,
  List,
  Badge,
  IconButton,
} from "@material-ui/core";
import { useStateValue } from "../context/StateProvider";
import { MoreVertOutlined } from "@material-ui/icons";
import UserMenu from "./UserMenu";
import GroupChatMenu from "./GroupChatMenu";
import axios from "axios";

const API = process.env.REACT_APP_API;
const useStyles = makeStyles((theme) => ({
  // root: {
  //   width: "100%",
  //   height: "100%",
  // },
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
  render__input: {
    outline: "none",
    border: "1px solid #eee",
    borderRadius: "5px",
    Height: "10px !important",
  },
  render__button: {
    flex: 0,
  },
}));

export default function RenderUser({ item }) {
  const classes = useStyles();

  const [{ isLogin }, dispatch] = useStateValue();
  // const [request, setRequest] = useState(false);
  const [chat, setChat] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [groupChat, setGroupChat] = useState(null);
  const [gcprofile, setGcProfile] = useState(null);
  const [friendprofile, setFriendProfile] = useState(null);

  const [imageFile, setImageFile] = useState({});

  const handleSwitch = (item) => {
    setChat(!chat);
    if (!isLogin) {
      // alert("Please login to chat with friends");
      // return;
    }

    localStorage.removeItem("peeruser");
    // localStorage.removeItem("currentuser");
    const peeruser = {
      peerid: item.id,
      peername: item.name,
    };

    // createContact(item.id, item.name);
    localStorage.setItem("peeruser", JSON.stringify(peeruser));

    dispatch({
      type: "CHATROOM_OPEN",
      isChatOpen: chat,
      peerid: item.id,
      peername: item.name,
      notify: true,
    });
  };

  const handleListItemClick = (e, item) => {
    e.preventDefault();
    setFriendProfile(item);
    if (e.type === "click") {
      handleSwitch(item);
    } else if (e.type === "contextmenu") {
      if (item.id.match(/(19):/)) {
        setGroupChat(e.currentTarget);
        setGcProfile(item);
      } else {
        setAnchorEl(e.currentTarget);
      }
    }
  };

  const handleAnchorEl = (e) => {
    // setAnchorEl(e.currentTarget);
  };

  const handleMouseEnter = (id) => {
    try {
      document.getElementById(id).style.display = "block";
    } catch (e) {
      console.log(e);
    }
  };
  const handleMouseLeave = (id) => {
    try {
      document.getElementById(id).style.display = "none";
    } catch (e) {}
  };

  const handleProfileImage = useCallback(() => {
    axios
      .get(`${API}/viewprofile/${item.id}`)
      .then((resp) => {
        axios
          .get(`${API}/uploadfile/${resp.data.imageid}`)
          .then((resp) => {
            setImageFile({
              file: resp.data.file,
              filename: resp.data.filename,
              contenttype: resp.data.contenttype,
            });
          })
          .catch((error) => console.log("Error: ", error));
      })
      .catch((error) => console.log("Error: ", error));
  }, [item.id]);

  useEffect(() => {
    handleProfileImage();
  }, [handleProfileImage]);

  return (
    <div>
      <List>
        <div
          onMouseLeave={() => handleMouseLeave(item.id)}
          style={{ display: "flex" }}
        >
          <ListItem
            data-item="chat"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "0.5rem",
              marginLeft: "0.5rem",
            }}
            button
            onMouseEnter={() => handleMouseEnter(item.id)}
            onClick={(e) => handleListItemClick(e, item)}
            onContextMenu={(e) => handleListItemClick(e, item)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <ListItemAvatar>
                <Badge badgeContent={item.notification} color="secondary">
                  {imageFile?.file ? (
                    <Avatar
                      alt="pic"
                      src={`data:${imageFile.contenttype};base64, ${imageFile.file}`}
                      className={classes.avatar}
                    />
                  ) : (
                    <Avatar
                      alt="pic"
                      src="https://picsum.photos/200/300?random=2"
                      className={classes.avatar}
                    />
                  )}
                </Badge>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
            </div>

            <div
              style={{
                width: "3rem",
                height: "3rem",
                alignItems: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
              }}
            >
              <IconButton
                id={item.id}
                onClick={handleAnchorEl}
                className={classes.moreIcon}
              >
                <MoreVertOutlined
                  style={{ width: "1.3rem", height: "1.3rem" }}
                />
              </IconButton>
            </div>
          </ListItem>
        </div>
      </List>
      <UserMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        profile={friendprofile}
      />
      <GroupChatMenu
        anchorEl={groupChat}
        setAnchorEl={setGroupChat}
        groupChat={gcprofile}
      />
    </div>
  );
}

/* 
  <UserMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        profile={friendprofile}
      />
      <GroupChatMenu
        anchorEl={groupChat}
        setAnchorEl={setGroupChat}
        groupChat={gcprofile}
      /> 
     </div> 

*/
