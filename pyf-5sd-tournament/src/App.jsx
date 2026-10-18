
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Schedule from "./pages/Schedule";
import Standings from "./pages/Standings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ManageMatches from "./pages/admin/ManageMatches";
import ManageTeams from "./pages/admin/ManageTeams";
import ScrollToTop from "./components/ScrollToTop";

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
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/standings" element={<Standings />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> 
        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute>
              <ManageMatches />
            </ProtectedRoute>
          }
        />    
        <Route
          path="/admin/teams"
          element={
            <ProtectedRoute>
              <ManageTeams />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
