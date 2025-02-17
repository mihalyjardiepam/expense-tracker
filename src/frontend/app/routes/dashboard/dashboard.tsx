import { Outlet } from "react-router";
import Navbar from "~/components/Navbar";

function Dashboard() {
  return (
    <>
      <p>Dashboard!</p>
      <Outlet />
    </>
  );
}

export default Dashboard;
