import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import MuiDialogTitle from "@material-ui/core/DialogTitle";

import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#000",
    // border: "2px solid #eee",
    // boxShadow: theme.shadows[5],
    // padding: theme.spacing(1, 1, 2),
    margin: theme.spacing(0),
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),

    flexDirection: "column",
    outline: "none",
    borderRadius: "5px",
  },
}));

const styles = (theme) => ({
  root: {
    position: "relative",
    margin: 0,
    padding: theme.spacing(0),
    marginLeft: "auto",
  },
  closeButton: {
    // position: "absolute",
    // right: theme.spacing(0),
    // top: theme.spacing(0),
    // marginLeft: "0.3rem",
    // marginBottom: "0.3rem",
    color: theme.palette.secondary.dark,

    "&:hover": {
      backgroundColor: "#424242",
    },
  },
});

const ModalTitle = withStyles(styles)((props) => {
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

export default function ImageMessageModal({ open, setOpen, myimage }) {
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <ModalTitle id="customized-dialog-title" onClose={handleClose} />
            <img
              src={`data:;base64, ${myimage}`}
              style={{ width: "90%" }}
              alt="file"
            />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

// <img
// src={`data:image/png;base64, ${myimage}`}
// style={{ width: "90%" }}
// alt="file"
// />
