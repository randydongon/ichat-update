import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";

import MuiDialogContent from "@material-ui/core/DialogContent";

import IconButton from "@material-ui/core/IconButton";

import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import CreateGC from "./CreateGC";

import AddMemberToGC from "./AddMemberToGC";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";

const useStyle = makeStyles((theme) => ({
  div__dialogtitle: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#e74b3b",
    color: "antiquewhite",
    height: "fit-content",
  },
}));

// const DialogTitle = withStyles(styles)((props) => {
//   const { children, classes, onClose, ...other } = props;
//   return (
//     <MuiDialogTitle disableTypography className={classes.root} {...other}>
//       <Typography variant="h6">{children}</Typography>
//       {onClose ? (
//         <IconButton
//           aria-label="close"
//           className={classes.closeButton}
//           onClick={onClose}
//         >
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </MuiDialogTitle>
//   );
// });

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

// const DialogActions = withStyles((theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//   },
// }))(MuiDialogActions);

export default function CreateGroup({ open, setOpen }) {
  const classes = useStyle();
  const [input, setInput] = useState("");
  const [gimage, setGImage] = useState(null);

  const [openAdd, setOpenAdd] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <div className={classes.div__dialogtitle}>
          <IconButton onClick={() => setOpenAdd(false)}>
            <ArrowBackOutlinedIcon />
          </IconButton>
          <span>Create new group</span>
          <IconButton onClick={handleClose}>
            <CloseOutlinedIcon />
          </IconButton>
        </div>
        <DialogContent dividers>
          {openAdd ? (
            <AddMemberToGC
              input={input}
              setInput={setInput}
              gimage={gimage}
              setGImage={setGImage}
              setOpen={setOpen}
            />
          ) : (
            <CreateGC
              input={input}
              setInput={setInput}
              gimage={gimage}
              setGImage={setGImage}
              setOpenAdd={setOpenAdd}
            />
          )}
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleNewGroup} color="primary">
            Add Group Member
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

/*
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
          friends_list: [],
        })
        .then((resp) => {
          console.log(resp.data);
          setInput("");
        })
        .catch((error) => console.log("Errror: ", ErrorEvent));
    }
  },
  [input]
);
*/

// const uploadProfileImage = useCallback(() => {
//   const formData = new FormData();
//   formData.append("file", gimage);
//   axios
//     .post(`${API}/uploadfile`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     })
//     .then((resp) => {
//       addNewGroupChat(resp.data.msgid["$oid"]);
//       setGImage(null);
//       // return resp.data["$oid"];
//     })
//     .catch((error) => console.log("Error: ", error));
// }, [addNewGroupChat, gimage]);

// const handleNewGroup = (e) => {
//   e.preventDefault();
//   if (input && gimage) {
//     //   console.log(input, gimage);
//     // setMember(true);
//   }
// if (gimage) {
//   uploadProfileImage();
// } else {
//   addNewGroupChat();
// }
// };
