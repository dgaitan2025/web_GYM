const res = await fetch("https://Compiladores2025.somee.com/api/Login/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: email,        // ✅ La API espera "usuario"
          contraseña: password,  // ✅ La API espera "contraseña"
        }),
      });