import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalRecuperarClave from '../Componente/ModalRecuperarClave';
import { login } from "../Funciones/login";
import { Procesando } from "../Componente/Espera";
import "./Login.css";

export default function Login() {
  const { showLoading, closeLoading } = Procesando();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");      // Usado para el campo "usuario"
  const [password, setPassword] = useState("3BFB9F5A"); // Usado para "contraseña"
  const [recordar, setRecordar] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const RecuperarClave = () => {
    setMostrarModal(true);
  };

  const CerrarModal = () => {
    setMostrarModal(false);
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('recordarEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRecordar(true); // marcar el checkbox
    }
  }, []);

  const handleCheckboxChange = (e) => {
    setRecordar(e.target.checked);
  };

  const handleSubmit = async (e) => {
    showLoading("Login","Procesando");
    e.preventDefault();

    try {
      const credeciales = {
        usuario: email,        // ✅ La API espera "usuario"
        contraseña: password,  // ✅ La API espera "contraseña"
      }

      const parametros = await login(credeciales);

      if (parametros.success) {
        closeLoading(true, "Bienvenido");
        navigate("/sitedinamic");
      }

      if (recordar) {
        localStorage.setItem('recordarEmail', email);
      } else {
        localStorage.removeItem('recordarEmail');
      }

    } catch (error) {
      closeLoading(false, "Error en la respuesta.");
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
            <input type="checkbox" checked={recordar} onChange={handleCheckboxChange} /> Recordar
          </label>

          <button type="button" onClick={RecuperarClave} className="forgot-link">
            Olvidé mi Contraseña
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <button type="submit" className="btn-login">
            Ingresar
          </button>
        </form>
        <ModalRecuperarClave visible={mostrarModal} onClose={CerrarModal} />
      </div>


    </div>
  );
}
