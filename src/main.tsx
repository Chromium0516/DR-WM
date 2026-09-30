import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./Home";
import "./styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing page root");
createRoot(root).render(<StrictMode><Home /></StrictMode>);
