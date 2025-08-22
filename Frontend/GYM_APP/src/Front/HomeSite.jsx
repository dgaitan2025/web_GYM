import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeSite.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  return (
    <>
      {/* Navbar */}


      <nav className="navbar navbar-expand-md  navbar-dark shadow-sm px-4 fixed-top bg-black-transparent">
        <div className="container-sm ">
          <div className="logo" onClick={scrollToTop} style={{ cursor: "pointer" }}>
            <img src="/fit.jpg" alt="Logo GYM" className="logo-img" style={{ height: "75px" }} />
          </div>

          <button className="navbar-toggler" type="button" onClick={toggleMenu}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto mb-2 mb-md-0 gap-3 color-text">
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
                <button className="btn btn-outline-primary" onClick={() => navigate("/login")}>
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
        data-bs-interval="3000" >
      
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
    <div className="index">
        <section id="servicios">
          <h2>Servicios</h2>
          <p>
            Área de pesas libres y máquinas de fuerza.<br />
            Zona de cardio (cintas, elípticas, bicicletas, escaladoras).<br />
           Clases grupales (spinning, zumba, aeróbicos, funcional, body pump, etc.).<br />
            Vestuarios y duchas.<br />
            Locker o casilleros de seguridad.<br />
          </p>
        </section>

        <section id="horarios" >
          <h2>Horarios</h2>
          <p>
            Lunes a Viernes: 5:00 a.m. – 10:00 p.m.<br />
            Sábado y Domingo: 6:00 a.m. – 9:00 p.m.
          </p>
        </section>

        <section id="ubicacion" >
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
  </div>
    </>
  );
}