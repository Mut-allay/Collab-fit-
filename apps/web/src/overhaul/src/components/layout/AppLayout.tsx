import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="overhaul dark min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary">
      <Outlet />
    </div>
  );
}
