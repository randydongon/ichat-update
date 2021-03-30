import React, { useState, useContext, useEffect } from "react";
import ChatBox from "./ChatBox";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { IconButton, Typography } from "@material-ui/core";
import RenderUser from "./RenderUser";
import { useStateValue } from "../context/StateProvider";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Grid from "@material-ui/core/Grid";
import CreateGroup from "./CreateGroup";
import Profile from "./Profile";
import ProfileMenu from "./ProfileMenu";
import { UserContext } from "../context/UserContext";
import { useImageProfile } from "../context/ImageProfileProvider";
import { IoMdCodeWorking } from "react-icons/io";
import SearchIcon from "@material-ui/icons/Search";
import SearchUser from "./SearchUser";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(1),
    boxSizing: "border-box",
    height: theme.spacing(100),
  },
  div__pane: {
    display: "flex",
    flexDirection: "column",
    margin: theme.spacing(1),
    boxSizing: "border-box",
    height: theme.spacing(100),
  },

  lefttop: {
    display: "flex",
    flex: 0,

    "& > *": {
      margin: theme.spacing(1),
      height: "fit-content",
    },
    padding: theme.spacing(1),
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #eee",
  },
  leftbody: {
    display: "flex",
    flex: 1,
    margin: theme.spacing(1),
    width: "100%",
    flexDirection: "column",
    border: "1px solid red",
  },
  chat__message: {},
  chat__divform: {
    flex: 0,
  },
  chat__formcontrol: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  chat__input: {
    flex: 1,
    width: "100%",
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  chat__iconbutton: {
    flex: 0,
  },

  group__btn: {
    border: "1px solid #eee",
    borderRadius: "5px",
    outline: "none",
  },

  divider: {
    margin: theme.spacing(2, 0),
  },
  cur__avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  profile__icon: {
    marginLeft: "auto",
  },

  div__creategroup: {
    display: "flex",
    padding: "0rem 0.5rem",
    margin: "0.3rem 0rem",
    justifyContent: "center",
  },
  avatar__img: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  div__renderuser: {
    display: "flex",
    flexDirection: "column",
    // height: "50%",
    width: "100%",
    // border: "1px solid #eee",
    paddingRight: "1rem",
    boxSizing: "border-box",
    "&:hover": {
      cursor: "pointer",
    },
  },
  user__render: {
    display: "block",
    flexDirection: "column",
    position: "relative",
    height: "80%",
    overflowY: "scroll",
    boxSizing: "border-box",
    borderTop: "1px solid #eee",
    borderBottom: "1px solid #eee",
    width: "100%",
  },
  div__searchicon: {
    width: "100%",
    border: "1px solid #eee",
    borderRadius: "1rem",
    paddingLeft: "1rem",
    alignItems: "center",
  },
}));

const Chat = () => {
  const classes = useStyles();

  const [{ isChatOpen }] = useStateValue();
  // const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { profile, isLogin, userProfile } = useContext(UserContext);
  const { imageFile, retrieveImage } = useImageProfile();
  const [request, setRequest] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);

  const handleProfile = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  useEffect(() => {
    retrieveImage(userProfile.imageid);
  }, [retrieveImage, userProfile.imageid]);

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} lg={3}>
          <Paper variant="outlined" className={classes.div__pane}>
            <div className={classes.lefttop}>
              <Avatar
                alt="pic"
                src={
                  imageFile?.file
                    ? `data:${imageFile?.contenttype};base64, ${imageFile?.file}`
                    : "https://picsum.photos/200/300?random=1"
                }
                className={classes.avatar__img}
              />

              <Typography variant="body2" component="span">
                {userProfile.user_name}
              </Typography>

              <IconButton
                onClick={handleProfile}
                className={classes.profile__icon}
                color="primary"
                variant="contained"
              >
                <MoreVertIcon />
              </IconButton>
            </div>
            <div className={classes.left__body}>
              <div>
                <div className={classes.renderuserdiv}>
                  <div className={classes.div__renderuser}>
                    {request ? (
                      <SearchUser setRequest={setRequest} />
                    ) : (
                      <div
                        className={classes.div__renderuser}
                        onClick={() => setRequest(true)}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            alignItems: "center",
                            padding: "1rem",
                          }}
                        >
                          <div className={classes.div__searchicon}>
                            <SearchIcon />
                          </div>
                          <IconButton
                            type="submit"
                            className={classes.render__button}
                          >
                            <IoMdCodeWorking />
                          </IconButton>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {request ? null : (
                <div className={classes.user__render}>
                  {isLogin
                    ? profile?.map((item, index) => (
                        <RenderUser key={index} item={item} />
                      ))
                    : null}
                </div>
              )}
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Paper variant="outlined" className={classes.div__pane}>
            {isChatOpen ? <ChatBox /> : null}
          </Paper>
        </Grid>
      </Grid>
      {openGroup ? (
        <CreateGroup open={openGroup} setOpen={setOpenGroup} />
      ) : null}
      <Profile
        open={openProfile}
        setOpen={setOpenProfile}
        profile={userProfile}
      />
      <ProfileMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        setOpen={setOpenProfile}
        setOpenGroup={setOpenGroup}
      />
    </div>
  );
};
export default Chat;

// const downloadFile = useCallback(async () => {
//   const base64Response = await fetch(
//     `data:${imageFile?.contenttype};base64,${imageFile?.file}`
//   );
//   const blob = await base64Response.blob();

//   setPhotoUrl(URL.createObjectURL(blob));
// }, [imageFile?.contenttype, imageFile?.file]);

// console.log(photoUrl);
