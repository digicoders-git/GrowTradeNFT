import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./Login";
import Register from "./Singhup";
import WelcomeCard from "./Welcome";
import MainDashBord from "../Dashbord/MainDashBord";
import Dashboard from "../Dashbord/Dashboard";
import MyTeam from "../Dashbord/MyTeam";
import MLMTree from "../Dashbord/MLMTree";
import Wallet from "../Dashbord/Wallet";
import History from "../Dashbord/History";
import NFTHistory from "../Dashbord/NFTHistory";
import NFTManagement from "../Dashbord/NFTManagement";
import NFTMarketplace from "../Dashbord/NFTMarketplace";
import PackageUpgrade from "../Dashbord/PackageUpgrade";
import AdminDashboard from "../Dashbord/AdminDashboard";
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
        <Route path="mlm-tree" element={<MLMTree />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="history" element={<History />} />
        <Route path="nft-history" element={<NFTHistory />} />
        <Route path="nft-management" element={<NFTManagement />} />
        <Route path="nft-marketplace" element={<NFTMarketplace />} />
        <Route path="package-upgrade" element={<PackageUpgrade />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default Routesr;