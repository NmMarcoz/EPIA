"use client";
import { useState, useRef, useContext } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Homepage } from "./pages/home/homepage";
import EditPage from "./pages/edit/editpage";
import { WebcamCapture } from "./pages/webcam/WebcamModal";
import Acess from "./pages/acess/Acces.tsx";
import "./App.css";
import DashboardPage from "./pages/dashboard/DashboardPage";
import type { Sector, UserSession, Worker } from "./utils/types/EpiaTypes.ts";
import * as epiaProvider from "./infra/providers/EpiaServerProvider.ts";
import { Setores } from "./pages/setores/Setores.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { InicioPage } from "./pages/inicio/Inicio.tsx";
import { ToastContainer, toast } from "react-toastify";
import { LogPage } from "./pages/logs/LogPage.tsx";
import NotificationBell from "./pages/components/NotificationBell";
import { EpiaContext } from "./infra/providers/EpiaProvider.tsx";
import { useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();
  return(
    <>
      <h2>
        Tela de inicio
      </h2>
    </>
  )
}

export default App;
