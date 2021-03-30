import React, { useContext, useState, useCallback } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API;

const ImageProfileContext = React.createContext();

export function useImageProfile() {
  return useContext(ImageProfileContext);
}

export function ImageProfileProvider({ children }) {
  const [imageFile, setImageFile] = useState({});
  // const [photoUrl, setPhotoUrl] = useState();

  // const downloadFile = useCallback(async (contenttype, file) => {
  //   const base64Response = await fetch(`data:${contenttype};base64,${file}`);
  //   const blob = await base64Response.blob();

  //   setPhotoUrl(URL.createObjectURL(blob));
  // }, []);

  const retrieveImage = useCallback(
    async (imageid) => {
      axios
        .get(`${API}/uploadfile/${imageid}`)
        .then((resp) => {
          // if (resp.data.file === "no") {
          //   setImageFile({});
          // } else {
          setImageFile({
            file: resp.data?.file,
            filename: resp.data?.filename,
            contenttype: resp.data?.contenttype,
          });

          // downloadFile(resp.data.contenttype, resp.data.file);
          // }
        })
        .catch((error) => console.log("Error: ", error));
    },
    [setImageFile]
  );

  return (
    <ImageProfileContext.Provider
      value={{ imageFile, setImageFile, retrieveImage }}
    >
      {children}
    </ImageProfileContext.Provider>
  );
}
