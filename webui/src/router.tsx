import { createBrowserRouter } from "react-router-dom";
import CardRouteComponent from "./routes/card/card";
import CategoryPickerRouteComponent from "./routes/category-picker/category-picker";

const router = createBrowserRouter([
  { path: "/", element: <CategoryPickerRouteComponent /> },
  { path: "/card", element: <CardRouteComponent /> },
]);

export default router;
