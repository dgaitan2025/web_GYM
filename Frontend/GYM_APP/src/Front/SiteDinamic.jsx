import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./SiteDinamic.css";

export default function SiteDinamic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (route) => {
    navigate(route);
    setMenuOpen(false); // cerrar el menú
  };

  const handleLogout = () => {
    localStorage.removeItem("isLogged");
    navigate("/");
  };

  return (
    <div className="container">
      {/* Navbar para móviles */}
      {isMobile && (
        <header className="navbar-dynamic">
          <div className="logo">
            <img src="/logo.png" alt="Logo GYM" className="logo-login" />
          </div>

          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`menu-dynamic ${menuOpen ? "open" : ""}`}>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Dashboard</button>
            <button onClick={() => handleNavigation("/sitedinamic/VistaUsuarios")}>Registrar Usuarios</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Registrar Empleados</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Renovar Membresía</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Reportes</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Usuarios</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Settings</button>
            <button className="logout" onClick={handleLogout}>Cerrar Sesión</button>
          </nav>
        </header>
      )}

      {/* Sidebar para escritorio */}
      {!isMobile && (
        <aside className="sidebar">
          <div className="logo">
            <img src="/logo.png" alt="Logo GYM" className="logo-login" />
          </div>
          <nav>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Dashboard</button>
            <button onClick={() => handleNavigation("/sitedinamic/VistaUsuarios")}>Registrar Usuarios</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Registrar Empleados</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Renovar Membresía</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Reportes</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Usuarios</button>
            <button onClick={() => handleNavigation("/sitedinamic/EnConstruccion")}>Settings</button>
          </nav>
          <div className="sidebar-footer">
            <button className="logout" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </aside>
      )}

      <section style={{ flex: 1 }}>
        <Outlet />
      </section>
    </div>
  );
}
