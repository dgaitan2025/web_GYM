export async function recuperarClave(correo) {
  const respuesta = await fetch("https://Compiladores2025.somee.com/api/Login/RecuperarContraseña", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(correo),
  });

  if (!respuesta.ok) {
    throw new Error("Error en la petición");
  }

  return await respuesta.json(); // 👈 el componente decide qué hacer con esto
}