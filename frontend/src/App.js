import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import ClerkAuthProvider from "@/components/auth/ClerkAuthProvider";
import { SiteContentProvider } from "@/context/SiteContent";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Leaderboard from "@/pages/Leaderboard";
import AdminPage from "@/pages/AdminPage";
import { SignInPage, SignUpPage } from "@/pages/AuthPages";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ClerkAuthProvider>
          <SiteContentProvider>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/organiser" element={<Navigate to="/admin" replace />} />
              <Route path="/sign-in/*" element={<SignInPage />} />
              <Route path="/sign-up/*" element={<SignUpPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </SiteContentProvider>
        </ClerkAuthProvider>
      </BrowserRouter>
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}

export default App;
