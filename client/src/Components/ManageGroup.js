import React, { useState, useEffect, useCallback, useRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { Avatar } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import Divider from "@material-ui/core/Divider";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";

import { Person } from "@material-ui/icons";
import axios from "axios";

const API = process.env.REACT_APP_API;

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 999,
    boxSizing: "border-box",
  },
  div__items: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "0.5rem 0",
    padding: "0.5rem",
    borderRadius: "3px",
    "&:hover": {
      cursor: "pointer",
      background: "#eee",
    },
  },

  checkbox__item: {
    marginLeft: "auto",
  },

  avatar__item: {
    marginRight: "1rem",
  },
  mgc__divider: {
    marginTop: "1rem",
  },
  gc__input: {
    outline: "none",
    border: "1px solid #eee",
    padding: "0.3rem 0.5rem",
    borderRadius: "1rem",
    fontSize: "1.2rem",
    textAlign: "center",
  },
  div__submain: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // padding: "1rem",

    boxSizing: "border-box",
  },
  div__one: {
    display: "flex",

    flexDirection: "column",
    margin: "1rem 0",
    justifyContent: "left",
  },
  div__input: {
    margin: "0.5rem 0",
  },
  graybackground: {
    background: "#eee",
    outline: "none",
    border: "1px solid #eee",
    padding: "0.5rem 0.5rem",
    borderRadius: "1rem",
    fontSize: "1.2rem",
    textAlign: "center",
    marginRight: "0.5rem",
    // borderTopLeftRadius: "1rem",
    // borderBottomLeftRadius: "1rem",
  },
  whitebackground: {
    background: "#fff",
    outline: "none",
    border: "1px solid #eee",
    padding: "0.5rem 0.5rem",
    fontSize: "1.2rem",
    textAlign: "center",
    borderRadius: "1rem",
    marginRight: "0.5rem",
    // borderTopLeftRadius: "1rem",
    // borderBottomLeftRadius: "1rem",
  },
}));

export default function ManageGroup({ open, setOpen, groupChat }) {
  const classes = useStyles();

  // const [gcname, setGcName] = useState(groupChat.name);
  const [gcmember, setGcMember] = useState([]);
  const [member, setMember] = useState([]);
  const [profile, setProfile] = useState([]);
  const [show, setShow] = useState(false);
  const [inputval, setInputval] = useState("");
  const [readOnly, setReadOnly] = useState(true);
  const inputElement = useRef(null);

  const handleClose = () => {
    if (inputval.length > 0) {
      // console.log(inputval);
      axios
        .put(`${API}/member/gc`, {
          name: inputval,
          gcid: groupChat.id,
          member: [],
        })
        .then((resp) => console.log(resp.data))
        .catch((error) => console.log("Error: ", error));
    } else {
      // console.log(inputval);
    }

    if (member.length > 0) {
      axios
        .put(`${API}/member/gc`, {
          member: member,
          gcid: groupChat.id,
          name: "",
        })
        .then((resp) => console.log(resp.data))
        .catch((error) => console.log("Error: ", error));
    } else {
      // console.log("no changes member");
    }

    setOpen(false);
  };

  const handleGCName = (e) => {
    // console.log(e.target.value);
    setInputval(e.target.value);
  };

  const handleGCMember = useCallback(() => {
    axios
      .get(`${API}/member/gc/${groupChat.id}`)
      .then((resp) => {
        setGcMember(resp.data);
        // setMember(resp.data);
      })
      .catch((error) => console.log("Error: ", error));
  }, [groupChat.id]);

  useEffect(() => {
    handleGCMember();
  }, [handleGCMember]);

  useEffect(() => {
    axios
      .get(`${API}/users/profile`)
      .then((resp) => {
        let mem = resp.data;
        gcmember.forEach((doc) => {
          mem = mem.filter((item) => item._id !== doc.id);
        });

        setProfile(mem.filter((item) => item._id.split(":")[0] !== "19"));
      })
      .catch((error) => console.log("Error: ", error));
  }, [gcmember]);

  const handleAddNewMember = (e, item) => {
    if (e.target.checked) {
      setMember((prevMem) => {
        const newMem = prevMem.filter((doc) => doc.id !== item._id);
        return [...newMem, { id: item._id, name: item.user_name }];
      });
    } else if (!e.target.checked) {
      const index = member.indexOf(item._id);
      member.splice(index, 1);
    }
  };

  const handleOpenInput = (e) => {
    e.preventDefault();
    setReadOnly(!readOnly);
  };

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  return (
    <div className={classes.root}>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          id="customized-dialog-title"
          style={{ background: "#e74b3b" }}
          onClose={handleClose}
        >
          {groupChat.name}
        </DialogTitle>
        <DialogContent dividers>
          <div className={classes.div__submain}>
            <Avatar>
              <Person />
            </Avatar>

            {/* <span stye={{ padding: 0 }}>{gcname}</span> */}
            <div className={classes.div__input}>
              <input
                autoFocus
                onFocus={(e) => e.currentTarget.select()}
                className={
                  readOnly ? classes.graybackground : classes.whitebackground
                }
                type="text"
                value={inputval}
                onChange={handleGCName}
                // readOnly={readOnly}
                ref={inputElement}
              />

              <EditOutlinedIcon
                style={{ cursor: "pointer" }}
                onClick={handleOpenInput}
              />
            </div>
          </div>

          <div>
            <span style={{ marginRight: "0.5rem" }}>{gcmember.length}</span>
            <span>Member</span>
            {/* {gcmember?.length ? (
              gcmember.map((item, index) => (
                <div key={index} className={classes.div__items}>
                  <Avatar className={classes.avatar__item}></Avatar>
                  <span>{item.name}</span>
                  <input
                    className={classes.checkbox__item}
                    type="checkbox"
                    value={item.id}
                    defaultChecked={checked.ismember}
                    // icon={<CircleUnchecked />}
                    // checkedIcon={<CircleChecked />}
                    onChange={(e) => handleChangeMember(e, item)}
                  />
                </div>
              ))
            ) : (
              <div></div>
            )} */}
          </div>
          <Divider className={classes.mgc__divider} />
          <div
            className={classes.div__one}
            // style={{
            //   display: "flex",

            //   flexDirection: "column",
            //   margin: "1rem 0",
            //   justifyContent: "left",
            // }}
          >
            <div>
              <IconButton onClick={() => setShow(!show)}>
                <PersonAddOutlinedIcon />
              </IconButton>
              <span>Add People</span>
            </div>

            {show
              ? profile.map((item, index) => (
                  <div key={index} className={classes.div__items}>
                    <Avatar className={classes.avatar__item}></Avatar>
                    <span>{item.user_name}</span>
                    <input
                      className={classes.checkbox__item}
                      type="checkbox"
                      value={item._id}
                      onChange={(e) => handleAddNewMember(e, item)}
                    />
                  </div>
                ))
              : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
