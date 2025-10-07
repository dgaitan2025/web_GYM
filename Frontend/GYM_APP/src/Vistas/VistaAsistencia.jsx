import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Swal from "sweetalert2";

const LectorQR = () => {
  const [cameras, setCameras] = useState([]);
  const [cameraId, setCameraId] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState("");
  const qrRegionId = "qr-region";
  const qrRef = useRef(null);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        setCameras(devices);
        if (devices && devices.length) {
          setCameraId(devices[0].id);
        }
      })
      .catch((err) => console.error("Error al obtener cámaras:", err));
  }, []);

  const startScanner = () => {
    if (!cameraId) return;

    const html5QrCode = new Html5Qrcode(qrRegionId);
    setScanning(true);

    html5QrCode
      .start(
        cameraId,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          if (decodedText !== lastResult) {
            setLastResult(decodedText);
            stopScanner()
            Swal.fire({
              icon: "success",
              title: "QR Detectado ✅",
              text: decodedText,
              timer: 2000,
              showConfirmButton: false,
            });
            console.log("Código detectado:", decodedText);
          }
        },
        (errorMessage) => {
          // no hacemos nada con los frames fallidos
        }
      )
      .catch((err) => {
        console.error("Error al iniciar escáner:", err);
        setScanning(false);
      });

    qrRef.current = html5QrCode;
  };

  const stopScanner = () => {
    if (qrRef.current) {
      qrRef.current.stop().then(() => setScanning(false));
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

      {/* Botones de control */}
      <div style={styles.buttons}>
        {!scanning ? (
          <button onClick={startScanner} style={styles.btnStart}>
            ▶ Iniciar lectura
          </button>
        ) : (
          <button onClick={stopScanner} style={styles.btnStop}>
            ⏹ Detener
          </button>
        )}
      </div>

      <p style={styles.result}>
        📦 Último resultado:{" "}
        <strong>{lastResult || "Esperando lectura..."}</strong>
      </p>
    </div>
  );
};

// 🎨 Estilos básicos
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
  buttons: { marginBottom: "10px" },
  btnStart: {
    background: "#28a745",
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
  },
  result: { marginTop: "10px", fontWeight: "bold" },
};

export default LectorQR;
