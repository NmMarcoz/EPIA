import { BrowserRouter, Routes, Route } from "react-router";
import { Homepage } from "../pages/home/homepage";
import { AuthPage } from "../pages/auth/AuthPage";
import { SideBar } from "../components/sidebar/Sidebar";
import { Config } from "../pages/config/Config";
import { ToastContainer } from "react-toastify";
import { LogPage } from "../pages/logs/LogPage";
import LogDetailed from "../pages/logs-detailed/LogDetailed";
import DashboardPage from "../pages/dashboard/DashboardPage";
import { SectorTable } from "../components/sector-table/SectorTable";
import Acess from "../pages/acess/Acces";
import "../globals.css";
import EditPage from "../pages/edit/Editpage";
export const MainRouter = () => {
    console.log("entrou pelo router");
    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route element={<SideBar />}>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/home" element={<Homepage />} />
                    <Route path="/config" element={<Config />} />
                    <Route path="/logs" element={<LogPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/logs/:logId" element={<LogDetailed />} />
                    <Route path="/sectors" element={<SectorTable />} />
                    <Route path="/sectors/:sectorId" element={<EditPage />} />
                    <Route path="/access" element={<Acess />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
