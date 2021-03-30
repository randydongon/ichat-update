import React, { useState, useEffect } from "react";
import { SocketProvider } from "../context/SocketProvider";

import Dashboard from "./Dashboard";
import { StateProvider } from "../context/StateProvider";
import reducer, { initialState } from "../context/reducer";
import { UserContext } from "../context/UserContext";
import { ImageProfileProvider } from "../context/ImageProfileProvider";
import { LogoutProvider } from "../context/LogoutProvider";

import Login from "./Login";

function App() {
  const [id, setId] = useState("");
  const [profile, setProfile] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [userProfile, setUserProfile] = useState({});

  useEffect(() => {
    const currentuser = localStorage.getItem("currentuser");

    if (currentuser == null) return;
    const user = JSON.parse(currentuser);
    setUserProfile(user);
    setId(user.id);
    setIsLogin(user.isLogin);
    const member = localStorage.getItem("profile");
    if (member == null) return;
    const friends = JSON.parse(member);
    setProfile(friends);
  }, []);

  // console.log(userProfile);

  const dashboard = (
    <SocketProvider id={id}>
      <UserContext.Provider
        value={{ profile, isLogin, setIsLogin, userProfile }}
      >
        <LogoutProvider>
          <ImageProfileProvider>
            <StateProvider reducer={reducer} initialState={initialState}>
              <Dashboard id={id} />
            </StateProvider>
          </ImageProfileProvider>
        </LogoutProvider>
      </UserContext.Provider>
    </SocketProvider>
  );

  return id ? (
    dashboard
  ) : (
    <Login
      onIdSubmit={setId}
      setProfile={setProfile}
      setIsLogin={setIsLogin}
      userProfile={userProfile}
      setUserProfile={setUserProfile}
    />
  );
}

export default App;
/*
const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider>
        <StateProvider reducer={reducer} initialState={initialState}>
          <Dashboard id={id} />
        </StateProvider>
      </ContactsProvider>
    </SocketProvider>
  );

  return id ? dashboard : <Login onIdSubmit={setId} />;
*/
