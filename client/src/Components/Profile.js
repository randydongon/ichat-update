import React, { useEffect, useState, useCallback } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import Avatar from "@material-ui/core/Avatar";
import axios from "axios";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import DraftsIcon from "@material-ui/icons/Drafts";
import PermIdentityIcon from "@material-ui/icons/PermIdentity";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import EmojiEmotionsOutlinedIcon from "@material-ui/icons/EmojiEmotionsOutlined";

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const API = process.env.REACT_APP_API;

const styles = (theme) => ({
  root: {
    display: "fle",
    flexDirection: "row",
    backgroundColor: "#f7b42c",
    backgroundImage: "linear-gradient(315deg, #f7b42c 0%, #fc575e 74%)",
    alignItems: "center",
    margin: 0,

    // padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(2.5),
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    backgroundColor: red[500],
    padding: theme.spacing(0),
    margin: theme.spacing(0),
  },
  avatar__image: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  div__pimage: {
    display: "flex",
    justifyContent: "center",
    // paddingLeft: theme.spacing(4),
  },
  dialog__title: {
    display: "fle",
    flexDirection: "row",
    backgroundColor: "#f7b42c",
    backgroundImage: "linear-gradient(315deg, #f7b42c 0%, #fc575e 74%)",
    alignItems: "center",
  },
  div__label: {
    right: theme.spacing(1),
    "&:hover": {
      cursor: "pointer",
    },
  },
  listitem__input: {
    display: "flex",
    position: "absolute",
    marginLeft: "2rem",
    // right: theme.spacing(9),
    top: theme.spacing(-5),
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "linear-gradient(315deg, #f7b42c 0%, #fc575e 74%)",
    // width: theme.spacing(0),
    height: theme.spacing(7),
    borderRadius: "50%",
  },
}));

export default function Profile({ open, setOpen, profile }) {
  const classes = useStyles();
  const [pImage, setPImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const profileImage = useCallback(() => {
    axios
      .get(`${API}/uploadfile/${profile?.imageid}`)
      .then((resp) => {
        if (resp.data.message !== "no") {
          setPImage(resp.data);
        }
      })
      .catch((error) => console.log("Error: ", error));
  }, [profile?.imageid]);

  useEffect(() => {
    profileImage();
  }, [profile, profileImage]);

  const handleChangeImage = (e) => {
    setImageFile(e.target.files[0]);
  };

  // update image id
  const updateImageId = useCallback(
    (imageid) => {
      axios
        .put(`${API}/imageprofile/update`, {
          id: profile?.id,
          imageid: imageid,
        })
        .then((resp) => {
          console.log(resp.data);
        })
        .catch((error) => console.log("Error", error));
    },
    [profile?.id]
  );

  // update image
  const updateImageProfile = useCallback(() => {
    // console.log(profile.id, profile.user_name, imageFile);
    if (imageFile !== null) {
      let formData = new FormData();
      // formData.append("caption", upload.name);
      formData.append("file", imageFile);
      axios
        .post(`${API}/uploadfile`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", //"application/x-www-form-urlencoded", //"multipart/form-data",
          },
        })
        .then((response) => {
          updateImageId(response.data.msgid["$oid"]);
          // sendMessage(response.data.msgid["$oid"]);
        })
        .catch((error) => console.log("Error: " + error))
        .finally(() => {
          // console.log(imageId, "finally");
          // sendMessage();
        });
    } else {
      // sendMessage("no");
    }
  }, [imageFile, updateImageId]);

  const handleClose = () => {
    if (imageFile) {
      updateImageProfile();
      setImageFile(null);
    } else {
      alert("Select an image ");
    }
    setOpen(false);
  };

  const handleCloseProfile = () => {
    setImageFile(null);
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Dialog
        onClose={handleCloseProfile}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseProfile}>
          <List style={{ display: "flex", alignItems: "center" }}>
            <Avatar aria-label="first letter" className={classes.avatar}>
              {profile?.user_name[0]}
            </Avatar>
            <span style={{ marginLeft: "1rem" }}>{profile?.user_name}</span>
          </List>
        </DialogTitle>
        <List className={classes.div__pimage}>
          <ListItem button className={classes.div__pimage}>
            <Avatar
              alt="pic"
              src={
                pImage
                  ? `data:${pImage.contenttype};base64, ${pImage?.file}`
                  : "https://picsum.photos/200/300?random=2"
              }
              className={classes.avatar__image}
            />

            <ListItemIcon className={classes.listitem__input}>
              <label className={classes.div__label} htmlFor="pimageid">
                <EditOutlinedIcon />
              </label>
              <input
                type="file"
                id="pimageid"
                name="pimageid"
                style={{ display: "none" }}
                onChange={handleChangeImage}
              />
            </ListItemIcon>
          </ListItem>
        </List>

        <List component="nav" aria-label="main mailbox folders">
          <ListItem button>
            <ListItemIcon>
              <PermIdentityIcon />
            </ListItemIcon>
            <ListItemText primary={profile?.id} />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <EmojiEmotionsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={profile?.user_name} />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary={profile?.email} />
          </ListItem>
        </List>
        <Divider />
        <List component="nav" aria-label="secondary mailbox folders">
          <ListItem button>
            <ListItemText primary="Trash" />
          </ListItem>
          <ListItemLink href="#simple-list">
            <ListItemText primary="Spam" />
          </ListItemLink>
        </List>
        <Divider />
        <List>
          <ListItem
            disabled={imageFile == null ? true : false}
            button
            autoFocus
            onClick={handleClose}
            color="primary"
          >
            Save changes
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
