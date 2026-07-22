import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppLayout() {
  return (
    <div className="overhaul dark min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary">
      <Outlet />
      <BottomNav />
    </div>
  );
}
