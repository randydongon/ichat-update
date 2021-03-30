import React from "react";
import { Route, Switch } from "react-router-dom";
import Chat from "./Chat";
import Home from "./Home";

import Navbar from "./Navbar";
import Profile from "./Profile";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/chat" component={Chat} />
        </Switch>
      </div>
    </div>
  );
};

export default Dashboard;
