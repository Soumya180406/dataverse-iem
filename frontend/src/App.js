import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Leaderboard from "@/pages/Leaderboard";
import Organiser from "@/pages/Organiser";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/organiser" element={<Organiser />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}

export default App;
