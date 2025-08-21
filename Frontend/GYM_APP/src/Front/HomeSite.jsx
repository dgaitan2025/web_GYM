import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularIndeterminate  from "../Componente/BarraProgreso"
import "./HomeSite.css";



export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  useEffect(() => {
    console.log("✅ Página Home montada");
    setOpen(true); // Abre el modal automáticamente al entrar
    return () => console.log("❌ Página Home desmontada");
  }, []);


  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-md bg-light shadow-sm py-0 px-4 sticky-top">
        <div className="container-sm d-flex flex-column flex-md-row justify-content-between align-items-center py-2">
          <div className="logo" onClick={scrollToTop} style={{ cursor: "pointer" }}>
            <img src="/fit.jpg" alt="Logo GYM" className="logo-img" style={{ height: "75px" }} />
          </div>

          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-md-0 gap-3">
              {["servicios", "horarios", "ubicacion", "contacto"].map((section) => (
                <li className="nav-item" key={section}>
                  <a
                    className="nav-link text-capitalize"
                    href={`#${section}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {section}
                  </a>
                </li>
              ))}
              <li className="nav-item">
                <button className="btn btn-outline-primary" onClick={() => { setOpen(true); navigate("/login") }} >
                  Login
                </button>
                


              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Carousel */}
      <div
        id="carouselExampleIndicators"
        className="carousel slide custom-carousel"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-indicators">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
              aria-current={i === 0 ? "true" : undefined}
              aria-label={`Slide ${i + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {["banner1.jpg", "banner2.jpg", "banner3.jpg"].map((src, i) => (
            <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={src}>
              <img src={`/${src}`} className="d-block w-100 carousel-img" alt={`Slide ${i + 1}`} />
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Secciones principales */}
      <main >
        <section id="servicios" className="mb-5">
          <h2>Servicios</h2>
          <ul>
            <li>Área de pesas libres y máquinas de fuerza.</li>
            <li>Zona de cardio (cintas, elípticas, bicicletas, escaladoras).</li>
            <li>Clases grupales (spinning, zumba, aeróbicos, funcional, body pump, etc.).</li>
            <li>Vestuarios y duchas.</li>
            <li>Locker o casilleros de seguridad.</li>
          </ul>
        </section>

        <section id="horarios" className="mb-5">
          <h2>Horarios</h2>
          <p>
            Lunes a Viernes: 5:00 a.m. – 10:00 p.m.<br />
            Sábado y Domingo: 6:00 a.m. – 9:00 p.m.
          </p>
        </section>

        <section id="ubicacion" className="mb-5">
          <h2>Ubicación</h2>
          <p>Colonia Las Brisas, Zona 6, Mixco, Guatemala.</p>
        </section>

        <section id="contacto" >
          <h2>Contacto</h2>
          <p>
            Teléfono: 2484-6583 <br />
            Correo: <a href="mailto:maljoss69@gmail.com">maljoss69@gmail.com</a>
          </p>
        </section>
      </main>
    </>
  );
}
