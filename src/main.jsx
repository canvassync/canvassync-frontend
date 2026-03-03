import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { LanguageProvider } from "./hooks/useLanguage.jsx";
import "./index.css";

import Landing  from "./CanvasSync.jsx";
import AppFree  from "./AppFree.jsx";
import App      from "./App.jsx";
import Entrar   from "./pages/Entrar.jsx";
import Checkout from "./pages/Checkout.jsx";
import Sucesso  from "./pages/Sucesso.jsx";
import Registro from "./pages/Registro.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
        <Routes>
          <Route path="/"            element={<Landing />} />
          <Route path="/entrar"      element={<Entrar />} />
          <Route path="/editor-free" element={<AppFree />} />
          <Route path="/cadastro"    element={<Registro />} />
          <Route path="/editor"      element={<App />} />
          <Route path="/planos"      element={<Checkout />} />
          <Route path="/sucesso"     element={<Sucesso />} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
