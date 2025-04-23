import "./App.css";

import { routesArray } from "./routes/routes.jsx";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter(
  routesArray,
  { future: { v7_startTransition: true, /* other flags */ } }
);

function App() { return <RouterProvider router={router} />; }
export default App;