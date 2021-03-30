import React, { forwardRef, useState, useEffect, useCallback } from "react";
import { Typography, makeStyles, Box } from "@material-ui/core";
import axios from "axios";
import "../Components/Message.css";
import ImageMessageModal from "./ImageMessageModal";
import download from "downloadjs";

// import excel from "xlsx";

const API = process.env.REACT_APP_API;
const useStyles = makeStyles((theme) => ({
  user: {
    color: "#3385c6",
    fontSize: "10px !important",
    flexWrap: "wrap",
    textAlign: "left",
    width: "fit-content",
  },
  tipspan: {
    fontSize: "12px !important",
    alignItems: "center",
  },
  tippy: {},
  message__image: {
    display: "flex",
    marginTop: "1rem",
    marginBottom: "1rem",
    width: "100px",
    height: "80px",
    justifyContent: "end",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const Message = forwardRef(({ message, username }, ref) => {
  const classes = useStyles();
  const isUser = username === message.fromname;

  // message date

  // const [fileId, setFileId] = useState("");

  // const [myimage, setMyImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [myfile, setMyFile] = useState({});
  const [imgfile, setImgFile] = useState(false);
  // const [urlfile, setUrlFile] = useState();

  const handleFile = useCallback(async () => {
    if (message.fileid === undefined) return;
    axios
      .get(`${API}/uploadfile/${message.fileid}`)
      .then((resp) => {
        if (resp.data.file === "no") {
          // setMyImage(null);
          setMyFile({});
        } else {
          // URL.createObjectURL(e.target.files[0])

          // match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)

          if (resp.data.filename)
            setImgFile(Boolean(resp.data.filename.match(/\.(jpeg|jpg|png)$/)));

          setMyFile({
            file: resp.data.file,
            filename: resp.data.filename,
            contenttype: resp.data.contenttype,
          });
          // setMyImage(resp.data.file);
        }
      })
      .catch((error) => console.log("Error : " + error));
  }, [message.fileid]);

  useEffect(() => {
    handleFile();
    setMyFile({});
  }, [handleFile]);

  const downloadFile = useCallback(async () => {
    const base64Response = await fetch(
      `data:${myfile.contenttype};base64,${myfile.file}`
    );
    const blob = await base64Response.blob();
    // URL.createObjectURL(e.target.files[0])
    // console.log(blob);

    return download(blob, myfile.filename, myfile.contenttype);
  }, [myfile.file, myfile.filename, myfile.contenttype]);

  return (
    // <div ref={ref} className="container">
    //   {message?.text ? (
    <div className={`messages__message ${isUser && "message_card"}`}>
      {!isUser ? (
        <Typography
          primary="white"
          variant="h6"
          component="span"
          className={classes.user}
        >
          {message.fromname}
        </Typography>
      ) : null}

      <div className={`${isUser ? "message_userCard" : "message_guestCard"}`}>
        <div className="message__content">
          <Box
            component="p"
            // flexWrap="wrap"
            // flexGrow={0}
            // flexShrink={1}
            whiteSpace="normal"
            className="text_message"
          >
            {message.text}
          </Box>
        </div>
      </div>
      {/* </div>
      ) : (
        <div className="container"></div>
      )}
      {myfile ? ( */}
      <div>
        {imgfile ? (
          <div
            className={`${isUser ? "div__imglinkuser" : "div__imglinkguest"}`}
          >
            <div className="message__image" onClick={() => setOpen(true)}>
              <img
                src={`data:${myfile.contenttype};base64, ${myfile.file}`}
                alt="file"
              />
            </div>
            <a href="#/" onClick={() => downloadFile()}>
              Download
            </a>
          </div>
        ) : (
          <div
            className={`${isUser ? "div__imglinkuser" : "div__imglinkguest"}`}
          >
            <a href="#/" onClick={() => downloadFile()} className="div__link">
              {myfile.filename}
            </a>
          </div>
        )}
      </div>

      <ImageMessageModal open={open} setOpen={setOpen} myimage={myfile.file} />
    </div>
  );
});

export default Message;
// component="div" whiteSpace="normal"
//  { <img src={`data:image/png;base64,${myimage}`} />}
// const formatDate = (value) => {
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "June",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   const msd = new Date(Number(value));
//   let date = msd.getDate();
//   const month = months[msd.getMonth()];
//   const year = msd.getFullYear();
//   const h = msd.getHours();
//   const m = msd.getMinutes();

//   if (date < 10) {
//     date = "0" + date;
//   }
//   const ampm = (h / 12) % 12 > 1 && (h / 12) % 12 < 2 ? "PM" : "AM";
//   return `${month} ${date}, ${year} at ${h}:${m} ${ampm}`;
// };

// let workbook = excel.readFile(resp.data.filex);
// console.log(workbook, "workbook"); //should print an array with the excel file data

/*
function ProcessExcel(data) {
    //Read the Excel File data.
    let workbook = excel.read(data, {
      type: "base64",
    });
    console.log(workbook.Strings[0].t);

    //Fetch the name of First Sheet.
    let firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    let excelRows = excel.utils.sheet_to_row_object_array(
      workbook.Sheets[firstSheet]
    );
    // console.log(excelRows);
    // 1
    //Create a HTML Table element.
    let table = document.createElement("table");
    table.border = "1";

    //Add the header row.
    let row = table.insertRow(-1);

    //Add the header cells.
    let headerCell = document.createElement("TH");
    headerCell.innerHTML = "Id";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Name";
    row.appendChild(headerCell);

    headerCell = document.createElement("TH");
    headerCell.innerHTML = "Country";
    row.appendChild(headerCell);

    //Add the data rows from Excel file.
    for (let i = 0; i < excelRows.length; i++) {
      //Add the data row.
      let ro = table.insertRow(-1);

      //Add the data cells.
      let cell = ro.insertCell(-1);
      cell.innerHTML = workbook.Strings[i].t;
      cell.style.color = "#000";
      cell.style.textAlign = "left";
      // console.log(workbook.Strings[i].t);
      // cell.innerHTML = workbook.Strings[0].t;

      // cell.innerHTML = excelRows[i].Id;

      cell = ro.insertCell(-1);
      cell.innerHTML = excelRows[i].Name;

      cell = ro.insertCell(-1);
      cell.innerHTML = excelRows[i].Country;
    }

    let dvExcel = document.getElementById("dvExcel");
    dvExcel.innerHTML = "";
    dvExcel.appendChild(table);
  }
*/
