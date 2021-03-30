import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import { Avatar, Input } from "@material-ui/core";
import "../Components/AddMemberToGC.css";
import Checkbox from "@material-ui/core/Checkbox";
import CircleChecked from "@material-ui/icons/CheckCircleOutline";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import { v4 as uuidv4 } from "uuid";

const useStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    flex: 1,
  },
  input__addgc: {
    width: "100%",
    outline: "none",
    borderRadius: "0",

    fontSize: "1.5rem",
    boxSizing: "border-box",
  },
  check__box: {
    border: "1px solid #ccc",
    outline: "none",
    borderRadius: theme.spacing(50),
    marginTop: theme.spacing(1),
    marginLeft: "auto",
    fontSize: "2rem",
  },
  div__listitems: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    marginTop: "0.5rem",
    paddingBottom: "0.5rem",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: "#ccc",
      cursor: "pointer",
    },
  },
  avatar__item: {
    marginRight: "1rem",
  },
  save__gc: {
    marginLeft: "auto",
  },
  div__savebutton: {
    display: "flex",
    width: "100%",
    marginTop: "2rem",
  },
}));

const API = process.env.REACT_APP_API;

export default function AddMemberToGC({
  input,
  setInput,
  gimage,
  setGImage,
  setOpen,
}) {
  const classes = useStyle();
  const [profile, setProfile] = useState([]);
  let [member, setMember] = useState([]);
  const [search, setSearch] = useState("");

  const searchProfile = useCallback(async () => {
    axios
      .get(`${API}/searchfriend/${search}`)
      .then((resp) => {
        setProfile(resp.data.filter((doc) => doc._id.split(":")[0] !== "19"));
      })
      .catch((error) => console.log("Error: ", error));
  }, [search]);

  useEffect(() => {
    searchProfile();
  }, [search, searchProfile]);

  //
  useEffect(() => {
    axios.get(`${API}/users/profile`).then((resp) => {
      setProfile(resp.data.filter((doc) => doc._id.split(":")[0] !== "19"));
      //
    });
  }, []);

  const handleCheckbox = (e, doc) => {
    if (e.target.checked) {
      setMember([...member, { id: doc._id, name: doc.user_name }]);
      console.log(doc);
    }
    if (!e.target.checked) {
      const index = member.indexOf(e.target.value);
      member.splice(index, 1);
    }
  };

  const addNewGroupChat = useCallback(
    (imageid) => {
      if (input) {
        axios
          .post(`${API}/adduser`, {
            _id: `19:${uuidv4()}`,
            user_name: input,
            email: `${input}@gmail.com`,
            password: "123",
            dob: new Date(),
            gender: "m",
            photo_url: "",
            imageid: imageid,
            isLogin: true,
            friends_list: member,
          })
          .then((resp) => {
            console.log(resp.data);
            setInput("");
            setMember([]);
            setOpen(false);
          })
          .catch((error) => console.log("Errror: ", error));
      }
    },
    [input, setInput, member, setOpen]
  );

  const uploadProfileImage = useCallback(() => {
    const formData = new FormData();
    formData.append("file", gimage);
    axios
      .post(`${API}/uploadfile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        addNewGroupChat(resp.data.msgid["$oid"]);
        setGImage(null);
        // return resp.data["$oid"];
      })
      .catch((error) => console.log("Error: ", error));
  }, [addNewGroupChat, gimage, setGImage]);

  const handleSaveGC = (e) => {
    e.preventDefault();

    if (gimage) {
      uploadProfileImage();
    } else {
      addNewGroupChat("");
    }
  };

  return (
    <div className={classes.root}>
      <div>
        <Input
          className={classes.input__addgc}
          type=""
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Seearch"
        />
      </div>
      <h5>Suggested</h5>
      <div>
        {profile?.map((doc, index) => (
          <div key={index} className={classes.div__listitems}>
            <ListItemAvatar>
              <Avatar className={classes.avatar__item} />
            </ListItemAvatar>
            <span>{doc.user_name}</span>
            <Checkbox
              icon={<CircleUnchecked />}
              checkedIcon={<CircleChecked />}
              value={doc._id}
              className={classes.check__box}
              onChange={(e) => handleCheckbox(e, doc)}
            />
          </div>
        ))}
      </div>
      <div className={classes.div__savebutton}>
        <Tooltip title="Save group chat" trigger="mouseenter">
          <IconButton className={classes.save__gc} onClick={handleSaveGC}>
            <SaveOutlinedIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}

// const GreenCheckbox = withStyles({
//   root: {
//     color: green[400],
//     "&$checked": {
//       color: green[600],
//     },
//   },
//   checked: {},
// })((props) => <Checkbox color="default" {...props} />);
