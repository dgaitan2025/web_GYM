export async function login(credenciales) {

    const respuesta = await fetch("https://Compiladores2025.somee.com/api/Login/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credenciales),
    });

    if (!respuesta.ok) throw new Error('Error al registrarse');
    const data = await respuesta.json();
    if (data.success) {
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("tipoUser", data.Tipo_Usuario);
        
    } else {
        alert("❌ Credenciales incorrectas");
    }
    return data;
}