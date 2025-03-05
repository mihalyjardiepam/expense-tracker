import { Outlet } from "react-router";
import "./dashboard.scss";
import React from "react";
import ColorGenTester from "~/components/ColorGenTester";
function Dashboard() {
  return (
    <>
      <Outlet />
      <ColorGenTester></ColorGenTester>
    </>
  );
}

export default React.memo(Dashboard);
