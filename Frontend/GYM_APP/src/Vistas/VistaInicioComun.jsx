import React from "react";
import "./VistaInicioComun.css";

const VistaInicioComun = () => {
  return (
    <main className="inicio-container">
      <header className="inicio-header">
        <h1>Bienvenido a Gym Brisas</h1>
        <p>Tu espacio para mantenerte en forma, saludable y motivado.</p>
      </header>

      <section className="inicio-section">
        <div className="inicio-card">
          
          <h3>Rutinas personalizadas</h3>
          <p>Explora nuestras rutinas para cada grupo muscular y nivel.</p>
        </div>

        <div className="inicio-card">
          
          <h3>Consejos de nutrición</h3>
          <p>Descubre cómo alimentar tu cuerpo para mejorar tu rendimiento.</p>
        </div>

        <div className="inicio-card">
          
          <h3>Comunidad Gym Brisas</h3>
          <p>Conéctate con otros usuarios y comparte tus progresos.</p>
        </div>
      </section>

      
    </main>
  );
};

export default VistaInicioComun;
