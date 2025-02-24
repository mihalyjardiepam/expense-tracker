import { Outlet } from "react-router";
import "./dashboard.scss";
import React from "react";

function Dashboard() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default React.memo(Dashboard);
