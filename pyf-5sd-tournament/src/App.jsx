
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Teams from "./pages/Teams";

function ComingSoon({ title }) {
  return (
    <main className="container coming-soon">
      <p className="section-label">PYF × 5SD</p>
      <h1>{title}</h1>
      <p>This page is coming soon.</p>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route
          path="/schedule"
          element={<ComingSoon title="Schedule & Results" />}
        />
        <Route
          path="/standings"
          element={<ComingSoon title="Standings" />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}
