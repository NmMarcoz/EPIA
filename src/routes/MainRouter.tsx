import { BrowserRouter, Routes, Route } from "react-router";
import { Homepage } from "../pages/home/homepage";
import { AuthPage } from "../pages/auth/AuthPage";
import { SideBar } from "../components/sidebar/Sidebar";
import { Config } from "../pages/config/Config";
import { ToastContainer } from "react-toastify";
import { LogPage } from "../pages/logs/LogPage";
import DashboardPage from "../pages/dashboard/DashboardPage";

export const MainRouter = () => {
    console.log("entrou pelo router");
    return (
        <BrowserRouter>
          <ToastContainer/>
            <Routes>
                <Route element={<SideBar />}>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/home" element={<Homepage />} />
                    <Route path="/config" element={<Config />} />
                    <Route path="/logs" element={<LogPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
