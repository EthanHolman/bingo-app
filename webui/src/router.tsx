import { BrowserRouter, Route, Routes } from "react-router";
import CategoryPickerRouteComponent from "./routes/category-picker/category-picker.tsx";
import CardRouteComponent from "./routes/card/card.tsx";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CategoryPickerRouteComponent />} />
      <Route path="/card/:id?" element={<CardRouteComponent />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
