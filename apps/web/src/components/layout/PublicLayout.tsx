import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * A standard layout for public-facing pages like Login and Signup.
 * It includes the landing page variant of the navbar and footer.
 */
export default function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar variant="landing" />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer variant="landing" />
        </div>
    );
}
