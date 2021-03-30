import React, { useCallback, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { TextField, Button, Card, Divider } from "@material-ui/core";
import axios from "axios";
import Signup from "./Signup";
import { useHistory } from "react-router-dom";

const API = process.env.REACT_APP_API;
const BootstrapButton = withStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    margin: "1rem auto",
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#e74b3b",
    borderColor: "#e74b3b",
    color: "white",
    outline: "none",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      backgroundColor: "#e74b3b",
      borderColor: "#e74b3b",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#e74b3b",
      borderColor: "#e74b3b",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  },
})(Button);
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "columnn",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    textAlign: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: "100%",
    },
  },
  signinbtn: {
    width: "100%",
    marginTop: "1ch",
    color: "white",
    fontWeight: "600",
    background: "#e74b3b",
  },
  label: {
    textTransform: "none",
  },
  signindiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginLeft: "auto",
    marginRight: "auto",
    minWidth: "auto",
    maxWidth: "300px",
  },
  signincard: {
    width: "100%",
    paddingTop: "1",
    paddingBottom: "1ch",
    flexDirection: "column",
  },
  divbtn: {
    width: "100%",
    marginTop: "1ch",
    color: "white",
    fontWeight: "600",
    backgroundColor: "#0392cf",
    height: "2.1rem",
    borderRadius: "0.2rem",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "0.7rem",
    "&:hover": {
      backgroundColor: "#7bc043",
    },
    "&:focus": {},
  },
  divider: {
    margin: theme.spacing(3),
  },
}));

const Login = ({
  onIdSubmit,
  setProfile,
  setIsLogin,
  userProfile,
  setUserProfile,
}) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = React.useState(false);

  let history = useHistory();

  const fetchData = useCallback(
    (id, user_name, isLogin) => {
      setIsLogin(isLogin);

      axios
        .get(`${API}/request/list/${id}`)
        .then((resp) => {
          const data = resp.data;
          localStorage.setItem("profile", JSON.stringify(resp.data));
          // console.log(data, " notification");
          try {
            setProfile(
              data.map((doc) => ({
                name: doc.name,
                id: doc.id,
                notification: doc.notification,
              }))
            );
          } catch (e) {
            console.log(e);
          }
        })
        .catch((error) => console.log("Error: ", error));
    },
    [setIsLogin, setProfile]
  );

  const handleLogin = useCallback(() => {
    const currentuser = localStorage.getItem("currentuser");
    if (currentuser !== null) return;
    if (email === "") {
      console.log("Email address not be empty");
      return;
    }
    if (password === "") {
      console.log("Password must not be empty!");
      return;
    }

    axios.get(`${API}/profile/${email}`).then((resp) => {
      const curuser = resp.data;
      // console.log(profile, " user profile");

      if (curuser.status === 400) {
        alert(curuser.message);
        return;
      }
      if (curuser.password === password) {
        console.log("Login successfully!");
        const email_add = curuser.email;

        localStorage.removeItem("currentuser");

        const currentuser = {
          id: curuser._id,
          email: email_add,
          user_name: curuser.user_name,
          photo_url: curuser.photo_url,
          isLogin: true,
          imageid: curuser.imageid,
        };
        setUserProfile(currentuser);
        fetchData(curuser?._id, curuser?.user_name, true);
        onIdSubmit(curuser?._id);

        localStorage.setItem("currentuser", JSON.stringify(currentuser));
        // localStorage.setItem("profile", JSON.stringify(profile));

        axios.put(`${API}/update`, {
          isLogin: false,
          email: email,
        });

        history.push("/chat");
      }
    });
    // setPassword("");
    // setEmail("");
  }, [email, history, onIdSubmit, password, fetchData, setUserProfile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  return (
    <div className={classes.signindiv}>
      <h1>Log In </h1>
      <Card className={classes.signincard}>
        <form
          onSubmit={handleSubmit}
          className={classes.root}
          noValidate
          autoComplete="off"
        >
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            variant="outlined"
            size="small"
            type="email"
          />

          <TextField
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            variant="outlined"
            size="small"
            type="password"
          />

          {/* <Link to="/chat"> */}
          <Button
            type="submit"
            // className={{
            //   root: classes.signinbtn,
            //   label: classes.label,
            // }}
            color="inherit"
            variant="contained"
            size="large"
          >
            Sign In
          </Button>
          {/* </Link> */}
        </form>
        <Divider className={classes.divider} />

        <BootstrapButton type="submit" onClick={() => setOpen(true)}>
          Create New Account
        </BootstrapButton>
      </Card>
      <Signup open={open} setOpen={setOpen} />
    </div>
  );
};

export default Login;

// websocket function
// const onWebsocket = (message) => {
//   if ("WebSocket" in window) {
//     console.log("websocket is support by your browser");

//     let ws = new WebSocket("ws://172.17.0.2:9393/ws/");

//     ws.onopen = function () {
//       console.log("Connection is open");
//       ws.send(message);
//     };

//     // ws.onmessage = function (evt) {
//     //   let msg = evt.data;
//     //   console.log("Message is receive " + msg);
//     // };

//     ws.onclose = function () {
//       console.log("Connection close");
//     };
//   } else {
//     console.log("WebSocket is not supported by your browser");
//   }
// };
