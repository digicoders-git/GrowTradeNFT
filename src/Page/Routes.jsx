import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./Login";
import Register from "./Singhup";
import WelcomeCard from "./Welcome";
import MainDashBord from "../Dashbord/MainDashBord";
import Dashboard from "../Dashbord/Dashboard";
import MyTeam from "../Dashbord/MyTeam";
import Wallet from "../Dashbord/Wallet";
import History from "../Dashbord/History";
import NFTHistory from "../Dashbord/NFTHistory";
import Profile from "../Dashbord/Profile";

function Routesr() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeCard />} />
      <Route path="/SingUp" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      
      <Route path="/dashbord" element={<MainDashBord />}>
        <Route index element={<Dashboard />} />
        <Route path="my-team" element={<MyTeam />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="history" element={<History />} />
        <Route path="nft-history" element={<NFTHistory />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default Routesr;