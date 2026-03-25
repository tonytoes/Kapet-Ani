import { RouterProvider } from "react-router-dom";
import router from "./routers/router.jsx";

function App() {
  return <RouterProvider router={router} />;
}

export default App;