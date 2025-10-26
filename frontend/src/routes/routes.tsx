import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/home";
import Login from "../pages/login/login";
import RoutesP from "../constants/routes";
import Control from "../pages/control/control";

export default function Router() {
  return (
    <Routes>
      <Route path={RoutesP.Home} element={<Home />} />
      <Route path={RoutesP.Login} element={<Login />} />
      <Route path={RoutesP.Control} element={<Control/>} />
    </Routes>
  );
}
