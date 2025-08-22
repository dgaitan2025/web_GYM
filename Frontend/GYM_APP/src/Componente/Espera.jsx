// ProcessModal.jsx
import React, { useEffect } from "react";

export default function Espera({
  open,
  status = "loading", // "loading" | "success" | "error"
  message = "Procesando...",
  onClose,
  autoCloseAfter = 1400, // ms (solo cuando success)
  blockCloseWhileLoading = true,
}) {
  useEffect(() => {
    if (open && status === "success" && autoCloseAfter && onClose) {
      const t = setTimeout(onClose, autoCloseAfter);
      return () => clearTimeout(t);
    }
  }, [open, status, autoCloseAfter, onClose]);

  if (!open) return null;

  const canClose = status !== "loading" || !blockCloseWhileLoading;

  return (
    <div className="pm-backdrop" onClick={canClose ? onClose : undefined}>
      <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
        {status === "loading" && (
          <>
            <div className="pm-spinner" />
            <h3 className="pm-title">Procesando...</h3>
            <p className="pm-text">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="pm-icon success" aria-hidden>
              <svg viewBox="0 0 24 24">
                <path d="M9 12.75l-2-2  -1.5 1.5 3.5 3.5 7.5-7.5 -1.5-1.5z" />
              </svg>
            </div>
            <h3 className="pm-title">¡Hecho!</h3>
            <p className="pm-text">{message}</p>
            <button className="pm-btn" onClick={onClose}>Cerrar</button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="pm-icon error" aria-hidden>
              <svg viewBox="0 0 24 24">
                <path d="M12 10.586l4.95-4.95 1.414 1.414L13.414 12l4.95 4.95-1.414 1.414L12 13.414l-4.95 4.95-1.414-1.414L10.586 12 5.636 7.05 7.05 5.636z"/>
              </svg>
            </div>
            <h3 className="pm-title">Algo salió mal</h3>
            <p className="pm-text">{message}</p>
            <button className="pm-btn" onClick={onClose}>Cerrar</button>
          </>
        )}
      </div>
    </div>
  );
}
