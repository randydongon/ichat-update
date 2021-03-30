import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import SendIcon from "@material-ui/icons/Send";
import Message from "./Message";
import FlipMove from "react-flip-move";
import FormControl from "@material-ui/core/FormControl";
import "../Components/ChatBox.css";
// import { useStateValue } from "../context/StateProvider";
import { Typography, ListItemAvatar } from "@material-ui/core";
import { useSocket } from "../context/SocketProvider";
import ImageRoundedIcon from "@material-ui/icons/ImageRounded";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

import { UserContext } from "../context/UserContext";
import usePeerUserProfile from "../hooks/usePeerUserProfile";
import axios from "axios";

const API = process.env.REACT_APP_API;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    height: theme.spacing(100),
  },
  //   media: {
  //     height: 0,
  //     paddingTop: "56.25%", // 16:9
  //   },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  card__header: {
    borderBottom: "1px solid #eee",
    boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.5)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  card_scolltobottom: {},
  card__flipmove: {
    minHeight: "200px",
    maxHeight: "350px",
  },

  card__content: {
    // height: theme.spacing(46),
    flex: 1,
  },
  card__cardactions: {
    margin: theme.spacing(1),
    flex: 0,
  },
  card__form: {
    // display: "flex",
    // width: "100%",
    width: "100%",
  },
  card__formcontrol: {
    display: "flex",
    // width: "100%",
    flexDirection: "row",

    width: "100%",
  },
  card__input: {
    display: "flex",
    flex: 1,
    padding: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    margin: theme.spacing(1),
    border: "1px solid #ccc",
    borderRadius: theme.spacing(5),
    outline: "none",
    wordWrap: "break-word",
    fontSize: theme.spacing(3),
  },
  card__iconbutton: {
    flex: 0,
  },
  customBadge: {
    backgroundColor: "#81b622",
    color: "white",
  },
  upload__file: {
    // border: "1px solid #eee",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    padding: "0.8rem",
    margin: "0.5rem",
    outline: "none",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#eee",
    },
  },
  form__group: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  view__addfile: {
    background: "#eee",
    width: "100%",
    height: "fit-content",
    borderRadius: "10px",
    marginRight: "1rem",
  },
  no__file: {
    background: "#fff",
    width: "90%",
    height: "fit-content",
  },
  chatdialog__message: {
    padding: "5% 0.5rem",
    overflow: "auto",
    flex: "auto",
    textAlign: "right",
    marginBottom: "2rem",
    scrollBehavior: "smooth",
    // scroll-behavior: smooth;
  },
  chatdialog__header: {
    display: "flex",
    border: "1px solid #eee",
    width: "inherit",
    padding: "0.5rem 0",
    paddingLeft: "0.5rem",
    alignItems: "center",

    // width: theme.spacing(100),
  },
  peer__avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  no__bottomline: {
    display: "flex",
  },
  with__bottomline: {
    display: "flex",

    borderBottom: "1px solid #aaa",
  },
  input__label: {},
}));

export default function ChatBox() {
  const classes = useStyles();
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const socket = useSocket();
  const [photourl, setPhotoUrl] = useState("");
  const messageEndRef = useRef(null);
  const [recipients, setRecipients] = useState([]);
  const [imageFile, setImageFile] = useState({});
  const [photos, setPhotos] = useState([]);
  const { userProfile } = useContext(UserContext);
  const [peeruser, setPeerUser] = usePeerUserProfile({});

  //
  const handleImageFile = useCallback((id) => {
    axios
      .get(`${API}/viewprofile/${id}`)
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
  }, []);

  //generate conversation id
  const conversationId = useCallback(() => {
    const user = userProfile;

    let peerhexid = peeruser.peerid;
    handleImageFile(peerhexid);

    if (peerhexid.match(/(19):/)) {
      axios
        .get(`${API}/request/list/${peerhexid}`)
        .then((resp) => {
          setRecipients(resp.data);
        })
        .catch((error) => console.log("Error: ", error));
      return peerhexid;
    } else {
      setRecipients([{ id: peeruser.peerid, name: peeruser.peername }]);
      peerhexid = peerhexid.split("-");

      let peerhexidstr = "";

      for (let i = 3; i < peerhexid.length; i++) {
        peerhexidstr = peerhexidstr.concat(peerhexid[i]);
      }

      const userhexid = user.id.split("-");
      let userhexidstr = "";

      for (let i = 3; i < userhexid.length; i++) {
        userhexidstr = userhexidstr.concat(userhexid[i]);
      }

      const converId = parseInt(userhexidstr, 16) + parseInt(peerhexidstr, 16);
      // setConversationId(converId);
      return converId;
    }
  }, [handleImageFile, peeruser, userProfile]);

  const addMessageToConversation = useCallback(
    ({ recipients, sender, message }) => {
      if (peeruser == null) return;

      if (sender !== peeruser.peerid) return;
      setConversations((prev) => [
        ...prev,
        {
          fromname: message.fromname,
          fromid: message.fromid,
          toid: message.toid,
          toname: message.toname,
          text: message.text,
          datesend: message.datesend,
          fileid: message.fileid,
        },
      ]);
    },
    [peeruser]
  );

  useEffect(() => {
    if (socket === null) return;
    socket.on("receive-message", addMessageToConversation);

    return () => socket.off("receive-message");
  }, [socket, addMessageToConversation]);

  //retreive messages from database and populate chatbox
  useEffect(() => {
    axios
      .get(`${API}/receivemessage/${conversationId()}`)
      .then((resp) => {
        // console.log(resp.data);
        setConversations(
          resp.data.map((doc) => ({
            fromname: doc.fromname,
            fromid: doc.fromid,
            toid: doc.toid,
            toname: doc.toname,
            text: doc.text,
            datesend: doc.datesend,
            fileid: doc.fileid,
          }))
        );
      })
      .catch((error) => console.log("Error:", error));
    // console.log(" retreive messages");
  }, [conversationId]);

  // send message
  const handleSendMessage = (e) => {
    e.preventDefault();

    //send file or image
    if (photos.length > 0) {
      let formData = new FormData();
      // formData.append("caption", upload.name);
      formData.append("file", photos[0].file);
      axios
        .post(`${API}/uploadfile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", //"application/x-www-form-urlencoded", //"multipart/form-data",
          },
        })
        .then((response) => {
          // setImageId(response.data.msgid["$oid"]);
          sendMessage(response.data.msgid["$oid"]);
        })
        .catch((error) => console.log("Error: " + error))
        .finally(() => {
          // console.log(imageId, "finally");
          // sendMessage();
        });
    } else {
      sendMessage("no");
    }

    setPhotos([]);
  };

  const sendMessage = (imageId) => {
    axios
      .post(`${API}/sendmessage`, {
        fromname: userProfile.user_name,
        text: input,
        fromid: userProfile.id,
        toid: peeruser.peerid,
        toname: peeruser.peername,
        conversation_id: conversationId(),
        fileid: imageId,
      })
      .then((resp) => {
        // console.log(resp, " send messge response");

        socket.emit("send-message", {
          recipients,
          message: {
            fromname: userProfile.user_name,
            text: input,
            fromid: userProfile.id,
            toid: peeruser.peerid,
            toname: peeruser.peername,
            conversation_id: conversationId(),
            fileid: imageId,
          },
          gcid: peeruser,
        });
        setConversations((prevCon) => [
          ...prevCon,
          {
            fromname: userProfile.user_name,
            text: input,
            fromid: userProfile.id,
            toid: peeruser.peerid,
            toname: peeruser.peername,
            conversation_id: conversationId(),
            fileid: imageId,
          },
        ]);
      })
      .catch(console.error)
      .finally(() => {
        // setFilePath(null)
        // setImageId("no");
        // setUpload(null);
        setPhotos([]);
        // setMessageId("");
      });

    setInput("");
  };

  //handle notification update when chatbox is open

  const notification = useCallback(async () => {
    await fetch(`${API}/sendmessage`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: userProfile.id,
        peerid: peeruser.peerid,
      }),
    });
  }, [userProfile.id, peeruser.peerid]);

  useEffect(() => {
    notification();

    setPhotoUrl("https://picsum.photos/200/300?random=2");
  }, [notification]);

  //handle input
  const handleInput = (e) => {
    setInput(e.target.value);
  };

  // function message scroll to bottom
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const closeChatBox = (e) => {
    e.preventDefault();
  };

  const handleUploadFile = (e) => {
    // setUpload(e.target.files[0]);
    setPhotos([{ name: e.target.files[0].name, file: e.target.files[0] }]);
  };

  //remove image fle
  const handleRemoveImage = useCallback(
    (e, index) => {
      e.preventDefault();

      let items = photos;
      items = items.splice(index, 1);
      setPhotos([...items]);
      if (photos.length <= 0) {
        setPhotos([]);
      }
    },
    [photos, setPhotos]
  );

  return (
    <div className="chatdialog__div">
      <div className="chatdialog__header">
        <ListItemAvatar className="listitem__avatar">
          <Avatar
            alt="pic"
            src={
              imageFile?.file
                ? `data:${imageFile?.contenttype};base64, ${imageFile?.file}`
                : photourl
            }
          />
        </ListItemAvatar>
        <Typography variant="h6" component="span">
          {peeruser.peername}
        </Typography>
        <IconButton onClick={closeChatBox} className="chatdialog__iconbtn">
          <CloseOutlinedIcon
            variant="contained"
            color="primary"
            className="chatdialog_closeicon"
          />
        </IconButton>
      </div>

      <div className="chatdialog__message">
        <FlipMove enterAnimation="elevator" leaveAnimation="elevator">
          {conversations
            ? conversations.map((message, index) => (
                <Message
                  key={index}
                  username={userProfile.user_name}
                  message={message}
                />
              ))
            : null}
        </FlipMove>
        <div ref={messageEndRef} />
      </div>

      <div className="div__form">
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <div
          className={
            photos.length > 0 ? classes.view__addfile : classes.no__file
          }
        >
          <div
            className={
              photos.length > 0
                ? classes.with__bottomline
                : classes.no__bottomline
            }
          >
            {photos
              ? photos.map((photo, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      position: "relative",
                      margin: "0.3rem",
                    }}
                  >
                    <IconButton
                      onClick={(e) => handleRemoveImage(e, index)}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "black",
                        backgroundColor: "wheat",
                      }}
                    >
                      <CloseOutlinedIcon />
                    </IconButton>
                    <img
                      src={URL.createObjectURL(photo.file)}
                      style={{ width: "150px", height: "150px" }}
                      alt="myimage"
                    />
                  </div>
                ))
              : null}
          </div>
          <form
            onSubmit={handleSendMessage}
            id="form_id"
            className={classes.card__form}
          >
            <FormControl className={classes.card__formcontrol}>
              <input
                id="outlined-textarea"
                className="input__message"
                onChange={handleInput}
                value={input}
              />
              <div className={classes.form__group}>
                <IconButton
                  type="submit"
                  onClick={handleSendMessage}
                  className={classes.card__iconbutton}
                >
                  <SendIcon />
                </IconButton>
                <label htmlFor="image-item" className={classes.input__label}>
                  <ImageRoundedIcon className={classes.upload__file} />
                </label>
                <input
                  id="image-item"
                  style={{ display: "none" }}
                  type="file"
                  name="image-item"
                  onChange={handleUploadFile}
                />
              </div>
            </FormControl>
          </form>
        </div>
      </div>
    </div>
  );
}

// const todaysDate = () => {
//   let date = new Date();
//   date = date.toString();
//   date = date.split("T");
//   let datestr = date[0];
//   return datestr;
// };

//handle file or image
// const handleFile = (e) => {
//    setFilePath(URL.createObjectURL(e.target.files[0]));
// };

// useEffect(() => {
//   if (upload == null) return;
//   if (!upload.name.match(/\.(jpeg|jpg|png)$/)) {
//     const fileName = upload.name;

//     const fileType = upload.type;

//     //just pass the fileObj as parameter
//   }
// }, [upload]);
