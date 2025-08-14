import { BrowserRouter, Routes, Route } from "react-router";
import { Homepage } from "../pages/home/HomePageView";
import { AuthPage } from "../pages/auth/AuthPageView";
import { SideBar } from "../components/sidebar/Sidebar";
import { Config } from "../pages/config/ConfigPageView";
import { ToastContainer } from "react-toastify";
import { LogPage } from "../pages/logs/LogPageView.tsx";
import LogDetailed from "../pages/logs-detailed/LogDetailedPageView.tsx";
import DashboardPage from "../pages/dashboard/DashboarPageView.ts";
import { SectorTable } from "../components/sector-table/SectorTable";
import Acess from "../pages/acess/AccesPageView";
import "../globals.css";
import EditPage from "../pages/edit/EditPageView.tsx";
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
