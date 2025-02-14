import { Outlet } from "react-router";

function Dashboard() {
  return (
    <>
      <p>Dashboard!</p>
      <Outlet />
    </>
  );
}

export default Dashboard;
