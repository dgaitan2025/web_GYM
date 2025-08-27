import Swal from "sweetalert2";

export function Procesando() {
  const showLoading = (title = "", texto="") => {
    Swal.fire({
      title,
      text: texto,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // 🔄 Spinner circular
      },
      showConfirmButton: false,
    });
  };

  const closeLoading = (success = true, message = "") => {
    Swal.close();
      if (success) {
    Swal.fire({
      title: message,
      icon: "success",
      timer: 1500,          // ⏳ Se cierra solo después de 3s
      showConfirmButton: false, // 👈 Oculta el botón OK
    });
  } else {
    Swal.fire({
      icon: "error",
      text: message,
      timer: 2000,
      showConfirmButton: false, // 👈 Oculta el botón OK
    });
  }
  };

  return { showLoading, closeLoading };
}
