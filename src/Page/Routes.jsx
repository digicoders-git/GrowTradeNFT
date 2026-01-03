import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./Login";
// import Singhup from "./Singhup";
import Register from "./Singhup";
import WelcomeCard from "./Welcome";
import Dashbord from "./Dashbord";

function Routesr() {
  return (
    <Routes>
      <Route path="/" element={<WelcomeCard />} />
      <Route path="/SingUp" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Dashbord" element={<Dashbord />} />
    </Routes>
  );
}

export default Routesr;
