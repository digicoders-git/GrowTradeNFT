import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./Login";
// import Singhup from "./Singhup";
import Register from "./Singhup";

function Routesr() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  );
}

export default Routesr;
