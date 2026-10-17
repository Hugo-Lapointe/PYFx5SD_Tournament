
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { name: "Home", path: "/" },
  { name: "Teams", path: "/teams" },
  { name: "Schedule", path: "/schedule" },
  { name: "Standings", path: "/standings" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to="/" className="nav-logo">
          PYF <span>×</span> 5SD
        </NavLink>

        <nav className={open ? "nav-links open" : "nav-links"}>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
