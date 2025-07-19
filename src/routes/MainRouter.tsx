import { BrowserRouter, Routes, Route } from "react-router";
import App from "../App";
import { Homepage } from "../pages/home/homepage";
import { AuthPage } from "../pages/auth/AuthPage";
import { SideBar } from "../pages/components/sidebar/Sidebar";

export const MainRouter = () => {
    console.log("entrou pelo router");
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<SideBar />}>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/home" element={<Homepage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
