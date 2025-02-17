import Navbar from "~/components/Navbar";
import type { Route } from "../+types/root";
import { Outlet } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Expense Tracker" },
    { name: "description", content: "Expense Tracker Application Home Page" },
  ];
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
