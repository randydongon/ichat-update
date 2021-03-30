import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import { useLogout } from "../context/LogoutProvider";

// import axios from "axios";
import { UserContext } from "../context/UserContext";

// const API = process.env.REACT_APP_API;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  textcolor: {
    textDecoration: "none",
    color: "white",
    fontWeight: "bold",
  },
  app__bar: {
    background: "#e74b3b",
    borderBottom: "0px",
    // --background: #e74b3b;
    // background: rgb(255,1,5);
    // --background: linear-gradient(270deg, #e74b3b 0%, rgba(180,0,25,1) 100%);
  },
}));

export default function Navbar() {
  const classes = useStyles();
  const { userLogOut } = useLogout();
  const { isLogin } = useContext(UserContext);

  // useEffect(() => {
  //   console.log("login from navbar");
  // }, [isLogin]);

  const handeleLogOut = (e) => {
    e.preventDefault();

    userLogOut();

    localStorage.clear();
  };

  // const handleFriendRequest = (e) => {
  //   // setAnchorEl(e.currentTarget);
  // };

  // const userLogOut = useCallback(
  //   (status) => {
  //     axios
  //       .put(`${API}/update`, {
  //         isLogin: status,
  //         user_id: userProfile.id,
  //       })
  //       .then((res) => {
  //         console.log(res.data);
  //         setIsLogin(false);
  //         window.location.reload();
  //         // socket.emit("messsage", { text: { user_name: user_name } });
  //       })
  //       .catch(console.error);

  //     // setUserLogin(false);
  //   },
  //   [userProfile.id, setIsLogin]
  // );

  // useEffect(() => {
  //   // setUserLogin(true);
  // }, [isLogin]);

  const hadleLogin = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.app__bar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            News
          </Typography>

          {isLogin ? (
            <Link to="/chat" className={classes.textcolor}>
              <Button color="inherit" onClick={handeleLogOut}>
                Log Out
              </Button>
            </Link>
          ) : (
            <div className={classes.textcolor}>
              <Button onClick={hadleLogin} color="inherit">
                Log In
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
