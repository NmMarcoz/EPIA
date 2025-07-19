import { BrowserRouter, Routes, Route } from "react-router";
import App from "../App";
import { Homepage } from "../pages/home/homepage";


export const MainRouter = ()=>{
  console.log("entrou pelo router");
  return(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>}/>
        <Route path="/home" element={<Homepage/>}/>
          
        </Routes>
    </BrowserRouter>
  )
}