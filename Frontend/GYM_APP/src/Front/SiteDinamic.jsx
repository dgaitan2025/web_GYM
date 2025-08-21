import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./SiteDinamic.css";

export default function SiteDinamic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const routes = [
    { path: "/sitedinamic/EnConstruccion", label: "Dashboard", roles: [4,1] },
    { path: "/sitedinamic/VistaUsuarios", label: "Registrar Usuarios", roles: [1] },
    { path: "/sitedinamic/EnConstruccion", label: "Registrar Empleados", roles: [1] },
    { path: "/sitedinamic/EnConstruccion", label: "Renovar Membresía", roles: [1] },
    { path: "/sitedinamic/EnConstruccion", label: "Reportes", roles: [1] },
    { path: "/sitedinamic/EnConstruccion", label: "Usuarios", roles: [1] },
    { path: "/sitedinamic/EnConstruccion", label: "Settings", roles: [1] },
  ];

  
useEffect(() => {
  const raw = localStorage.getItem("tipoUser"); // p.ej. "1"
  const r = raw !== null ? Number(raw) : null;

  if (Number.isFinite(r)) {
    setRole(r);
  } else {
    // No hay rol válido → vuelve al login
    navigate("/");
  }
}, [navigate]);


const visibleRoutes = useMemo(() => {
  if (role === null) return [];
  return routes.filter(r => r.roles.includes(role));
}, [role, routes]);


  const handleResize = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    if (!mobile) setMenuOpen(false);
  };

  const handleNavigation = (route) => {
    if (route) navigate(route);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("tipoUser");
    navigate("/");
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

const renderButtons = () =>
  visibleRoutes.map(({ path, label }) => (
    <button key={label} onClick={() => handleNavigation(path)}>
      {label}
    </button>
  ));

  return (
    <div className="container-fluid">
      {isMobile ? (
        <header className="navbar-dynamic">
          <div className="logo">
            <img src="/logo.png" alt="Logo GYM" className="logo-login" />
          </div>

          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`menu-dynamic ${menuOpen ? "open" : ""}`}>
            {renderButtons()}
            <button className="logout" onClick={handleLogout}>Cerrar Sesión</button>
          </nav>
        </header>
      ) : (
        <aside className="sidebar">
          <div className="logo">
            <img src="/logo.png" alt="Logo GYM" className="logo-login" />
          </div>
          <nav>{renderButtons()}</nav>
          <div className="sidebar-footer">
            <button className="logout" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </aside>
      )}
      <section className="content">
        <Outlet />
      </section>
    </div>
  );
}
