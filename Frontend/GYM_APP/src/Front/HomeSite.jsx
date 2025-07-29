import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ IMPORTANTE
import "./HomeSite.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // ✅ HOOK PARA NAVEGAR

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* ✅ Banner FUERA del contenedor home */}
      <section className="banner">
        <div className="slides">
          <img src="/banner1.jpg" alt="Foto 1" />
          <img src="/banner2.jpg" alt="Foto 2" />
          <img src="/banner3.jpg" alt="Foto 3" />
        </div>
      </section>

      <div className="home">
        {/* NAVBAR */}
        <header className="navbar">
          <div className="logo">
            <img src="fit.jpg" alt="Logo GYM" className="logo-img" />
          </div>

          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`menu ${menuOpen ? "open" : ""}`}>
            <a href="#servicios" onClick={() => setMenuOpen(false)}>
              Servicios
            </a>
            <a href="#horarios" onClick={() => setMenuOpen(false)}>
              Horarios
            </a>
            <a href="#ubicacion" onClick={() => setMenuOpen(false)}>
              Ubicación
            </a>
            <a href="#Contacto" onClick={() => setMenuOpen(false)}>
              Contacto
            </a>
            {/* ✅ Botón que redirige a /login */}
        <button
        className="login-btn"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
          </nav>
        </header>

        {/* SECCIONES */}
        <section id="servicios">
          <h2>Servicios</h2>
          <p>Aquí irá la descripción de los servicios.</p>
        </section>

        <section id="horarios">
          <h2>Horarios</h2>
          <p>Aquí irán los horarios.</p>
        </section>

        <section id="ubicacion">
          <h2>Ubicación</h2>
          <p>Dirección del gimnasio.</p>
        </section>

        <section id="Contacto">
          <h2>Contacto</h2>
          <p>Texto Contacto</p>
        </section>
      </div>
    </>
  );
}
