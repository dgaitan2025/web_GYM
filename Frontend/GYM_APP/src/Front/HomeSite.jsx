import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeSite.css";


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>

      {/* Navbar */}
      <header className="navbar navbar-expand-md bg-light shadow-sm py-0 px-4 sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="logo">
            <img
              src="/fit.jpg"
              alt="Logo GYM"
              className="logo-img"
              style={{ height: "75px", cursor: "pointer" }}
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
            />
          </div>

          {/* Hamburger */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-md-0 gap-3">
              <li className="nav-item">
                <a className="nav-link" href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#horarios" onClick={() => setMenuOpen(false)}>Horarios</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#ubicacion" onClick={() => setMenuOpen(false)}>Ubicación</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#Contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div id="carouselExampleIndicators" className="carousel slide custom-carousel" data-bs-ride="carousel" data-bs-interval="3000">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/banner1.jpg" className="d-block w-100 carousel-img" alt="..." />
          </div>
          <div className="carousel-item">
            <img src="/banner2.jpg" className="d-block w-100 carousel-img" alt="..." />
          </div>
          <div className="carousel-item">
            <img src="/banner3.jpg" className="d-block w-100 carousel-img" alt="..." />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>




      {/* Secciones */}
            <section id="servicios">
          <h2>Servicios</h2>
          <p>Área de pesas libres y máquinas de fuerza.<br></br>
            Zona de cardio (cintas, elípticas, bicicletas, escaladoras)<br></br>
            Clases grupales (spinning, zumba, aeróbicos, funcional, body pump, etc.)<br></br>
            Vestuarios y duchas<br></br>
            Locker o casilleros de segurida</p>
        </section>

        <section id="horarios">
          <h2>Horarios</h2>
          <p>Lunes a Viernes: 5:00 a.m. – 10:00 p.m.<br></br>
            Sábado: 6:00 a.m. – 21:00 p.m.<br></br>
            Domingo: 6:00 a.m. – 21:00 p.m.</p>
        </section>

        <section id="ubicacion">
          <h2>Ubicación</h2>
          <p>Colonia las brisas, zona 6 Mixco, Guatemala</p>
        </section>

        <section id="Contacto">
          <h2>Contacto</h2>
          <p>Telefono: 2484 - 6583 <br></br>
            Correo: maljoss69@gmail.com
          </p>
        </section>
   


    </>
  );
}
