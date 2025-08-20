import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./SiteDinamic.css";

export default function SiteDinamic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const routes = [
    { path: "/sitedinamic/EnConstruccion", label: "Dashboard" },
    { path: "/sitedinamic/VistaUsuarios", label: "Registrar Usuarios" },
    { path: "/sitedinamic/EnConstruccion", label: "Registrar Empleados" },
    { path: "/sitedinamic/EnConstruccion", label: "Renovar Membresía" },
    { path: "/sitedinamic/EnConstruccion", label: "Reportes" },
    { path: "/sitedinamic/EnConstruccion", label: "Usuarios" },
    { path: "/sitedinamic/EnConstruccion", label: "Settings" },
  ];

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
    navigate("/");
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderButtons = () =>
    routes.map(({ path, label }) => (
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
