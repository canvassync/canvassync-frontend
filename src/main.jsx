console.log("VITE_SUPABASE_ANON_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { LanguageProvider } from "./hooks/useLanguage.jsx";
import "./index.css";

import Landing    from "./CanvasSync.jsx";
import AppFree    from "./AppFree.jsx";
import App        from "./App.jsx";
import Entrar     from "./pages/Entrar.jsx";
import Checkout   from "./pages/Checkout.jsx";
import Sucesso    from "./pages/Sucesso.jsx";
import Registro   from "./pages/Registro.jsx";
import Termos     from "./pages/Termos.jsx";
import Privacidade from "./pages/Privacidade.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/"            element={<Landing />} />
            <Route path="/entrar"      element={<Entrar />} />
            <Route path="/editor-free" element={<AppFree />} />
            <Route path="/cadastro"    element={<Registro />} />
            <Route path="/editor"      element={<App />} />
            <Route path="/planos"      element={<Checkout />} />
            <Route path="/sucesso"     element={<Sucesso />} />
            <Route path="/termos"      element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
