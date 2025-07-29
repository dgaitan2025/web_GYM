import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");      // Usado para el campo "usuario"
  const [password, setPassword] = useState(""); // Usado para "contraseña"

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://Compiladores2025.somee.com/api/Empleadoes/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: email,        // ✅ La API espera "usuario"
          contraseña: password,  // ✅ La API espera "contraseña"
        }),
      });

      const data = await res.json();
      //console.log("Respuesta API:", data);

      if (data.success) {
        alert(`✅ ${data.message}`);
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("id_usuario", data.id_usuario); // Guardamos el ID si lo necesitas
        navigate("/sitedinamic");
      } else {
        alert("❌ Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("❌ Error de conexión con la API");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="/gym-login.jpg" alt="Gym" />
      </div>

      <div className="login-form">
        <img
          src="/logo.png"
          alt="Logo GYM"
          className="logo-login"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
        <h1 className="title">INICIAR SESIÓN</h1>
        <h3 className="welcome">¡Bienvenido!</h3>
        <p className="description">Ingresa tus credenciales</p>

        <form onSubmit={handleSubmit}>
          <label>Usuario</label>
          <input
            type="text"
            placeholder="Ingresa tu Usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="options">
            <label>
              <input type="checkbox" /> Recordar
            </label>
            <a href="/recuperar" className="forgot">
              Olvidé mi Contraseña
            </a>
          </div>

          <button type="submit" className="btn-login">
            Ingresar
          </button>
        </form>

        <p className="register">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="link-register">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
