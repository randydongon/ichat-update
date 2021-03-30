import React, { useContext, useCallback, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
const API = process.env.REACT_APP_API;
const UserLogoutContext = React.createContext();

export function useLogout() {
  return useContext(UserLogoutContext);
}

export function LogoutProvider({ children }) {
  const { isLogin, setIsLogin, userProfile } = useContext(UserContext);

  const userLogOut = useCallback(() => {
    axios
      .put(`${API}/update`, {
        isLogin: isLogin,
        user_id: userProfile.id,
      })
      .then((res) => {
        console.log(res.data);
        setIsLogin(false);
        window.location.reload();
        // socket.emit("messsage", { text: { user_name: user_name } });
      })
      .catch(console.error);

    // setUserLogin(false);
  }, [userProfile.id, setIsLogin, isLogin]);

  useEffect(() => {
    // setUserLogin(true);
  }, [isLogin]);

  return (
    <UserLogoutContext.Provider value={{ userLogOut }}>
      {children}
    </UserLogoutContext.Provider>
  );
}
