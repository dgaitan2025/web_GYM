import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Swal from "sweetalert2";
import { registrarAsistencia, registrarSalida } from "../Funciones/Api_asistencia";

const LectorQR = () => {
  const [cameras, setCameras] = useState([]);
  const [cameraId, setCameraId] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [modo, setModo] = useState(null); // 🔹 "entrada" o "salida"
  const [lastResult, setLastResult] = useState("");
  const qrRegionId = "qr-region";
  const qrRef = useRef(null);

  // 🔹 Obtener cámaras al montar
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices?.length) {
          setCameras(devices);
          setCameraId(devices[0].id);
        } else {
          Swal.fire("Sin cámara", "No se detectaron cámaras disponibles", "warning");
        }
      })
      .catch((err) => console.error("Error al obtener cámaras:", err));
  }, []);

  // 🔹 Iniciar el escáner
  const startScanner = async (tipo) => {
    if (!cameraId) return Swal.fire("Error", "Selecciona una cámara antes de iniciar", "error");
    if (scanning) return Swal.fire("Atención", "Ya hay un escaneo en proceso", "info");

    setModo(tipo);
    const html5QrCode = new Html5Qrcode(qrRegionId);
    qrRef.current = html5QrCode;
    setScanning(true);

    try {
      await html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          if (decodedText) {
            setLastResult(decodedText);
            stopScanner();

            // 🔹 Extraer el usuario del texto QR
            const usuario = decodedText.replace("Usuario:", "").trim();
            console.log(`Usuario detectado: ${usuario} | Modo: ${tipo}`);

            // 🔹 Determinar tipo de asistencia (1 = entrada, 2 = salida)
            const tipoAsistencia = tipo === "entrada" ? 1 : 2;
            console.log("valor de entrada ",  tipoAsistencia)

            try {
              if(tipoAsistencia === 1){
                  const asisREG = await registrarAsistencia(usuario, 1);
                   console.log("valor de entrada ",  asisREG)
                   setLastResult(decodedText);
              }else{
                  registrarSalida(usuario)
                   console.log("valor de Salida ",  tipoAsistencia)
                   setLastResult(decodedText);

              }
             
            } catch (error) {
              console.error("Error al registrar asistencia:", error);
              Swal.fire("Error", "No se pudo registrar la asistencia", "error");
            }
          }
        },
        (errorMessage) => {
          // Frame fallido (sin QR válido) → no hacemos nada
        }
      );
    } catch (err) {
      console.error("Error al iniciar escáner:", err);
      Swal.fire("Error", "No se pudo iniciar el lector", "error");
      setScanning(false);
    }
  };

  // 🔹 Detener escáner
const stopScanner = async () => {
  const qrInstance = qrRef.current;

  if (!qrInstance) {
    console.warn("No hay instancia activa del lector QR");
    return;
  }

  try {
    // 🔹 Primero detenemos el escáner y esperamos que termine
    await qrInstance.stop();
    console.log("✅ Escáner detenido correctamente.");

    // 🔹 Luego limpiamos la vista solo si existe el contenedor
    const qrRegionElement = document.getElementById(qrRegionId);
    if (qrRegionElement) {
      qrRegionElement.innerHTML = ""; // Limpia el div del video
    }

    // 🔹 Finalmente, reiniciamos estados
    setScanning(false);
    setModo(null);
    qrRef.current = null;
  } catch (err) {
    console.error("❌ Error al detener el escáner:", err);

    // 🔹 En caso de error, intenta forzar la limpieza manual
    const videoTracks = document.querySelectorAll("video");
    videoTracks.forEach((video) => {
      video.srcObject?.getTracks().forEach((track) => track.stop());
    });

    setScanning(false);
    setModo(null);
    qrRef.current = null;
  }
};


  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lector de Código QR</h2>

      {/* Selector de cámara */}
      <div style={styles.selectContainer}>
        <label>Seleccionar cámara: </label>
        <select
          value={cameraId || ""}
          onChange={(e) => setCameraId(e.target.value)}
          disabled={scanning}
        >
          {cameras.map((cam, idx) => (
            <option key={idx} value={cam.id}>
              {cam.label || `Cámara ${idx + 1}`}
            </option>
          ))}
        </select>
      </div>

      {/* Región de video */}
      <div id={qrRegionId} style={styles.qrBox}></div>

      {/* Botones */}
      <div style={styles.buttons}>
        {!scanning ? (
          <>
            <button onClick={() => startScanner("entrada")} style={styles.btnEntrada}>
              ▶ Registrar Entrada
            </button>
            <button onClick={() => startScanner("salida")} style={styles.btnSalida}>
              ⏩ Registrar Salida
            </button>
          </>
        ) : (
          <button onClick={stopScanner} style={styles.btnStop}>
            ⏹ Detener Lector
          </button>
        )}
      </div>

      <p style={styles.result}>
        📦 Último resultado: <strong>{lastResult || "Esperando lectura..."}</strong>
      </p>
    </div>
  );
};

// 🎨 Estilos
const styles = {
  container: {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: { color: "#0d1d3a", marginBottom: "15px" },
  selectContainer: { marginBottom: "10px" },
  qrBox: {
    width: "100%",
    height: "320px",
    border: "3px solid #0d1d3a",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "15px",
  },
  btnEntrada: {
    background: "#007bff",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnSalida: {
    background: "#17a2b8",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnStop: {
    background: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },
  result: { marginTop: "10px", fontWeight: "bold" },
};

export default LectorQR;
