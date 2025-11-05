import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/home";
import Login from "../pages/login/login";
import RoutesP from "../constants/routes";
import Control from "../pages/control/control";
import ReportList from "../pages/reportList/reportList";
import CnhList from "../pages/cnhList/cnhList";
import CnhValidate from "../pages/cnhValidate/cnhValidate";

export default function Router() {
  return (
    <Routes>
      <Route path={RoutesP.Home} element={<Home />} />
      <Route path={RoutesP.Login} element={<Login />} />
      <Route path={RoutesP.Control} element={<Control />} />
      <Route path={RoutesP.ReportList} element={<ReportList />} />
      <Route path={RoutesP.CnhList} element={<CnhList />} />
      <Route path={RoutesP.cnhValidate} element={<CnhValidate/>}/>
    </Routes>
  );
}
