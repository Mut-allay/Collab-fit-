import { Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";

export default function AppLayout() {
    return (
        <>
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </>
    );
} 