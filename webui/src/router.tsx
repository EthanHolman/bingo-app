import { Route, Routes } from "react-router";
import HomeRouteComponent from "./routes/home/home.tsx";
import CardRouteComponent from "./routes/card/card.tsx";

const Router = () => (
  <Routes>
    <Route path="/" element={<HomeRouteComponent />} />
    <Route path="/card/:id?" element={<CardRouteComponent />} />
  </Routes>
);

export default Router;
