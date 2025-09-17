import {encryptString} from "./Encriptar"
import { Procesando } from "../Componente/Espera";
import {UrlWithApi, ENDPOINTS} from "../Service/apiConfig"

export async function login(credenciales) {
    const { showLoading, closeLoading } = Procesando();
    
    const respuesta = await fetch(UrlWithApi(ENDPOINTS.login), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credenciales),
    });

    if (!respuesta.ok) throw new Error('Error al registrarse');
    const data = await respuesta.json();
    if (data.success) {


        const tipoUserCif = encryptString(data.Tipo_Usuario); // asegúrate de que venga en data
        localStorage.setItem("tipoUser", tipoUserCif);
        
        const isLogged = encryptString("true");
        localStorage.setItem("isLogged", isLogged);
        
        
    } else {
        closeLoading(false,"Credenciales incorrectas");
        
    }
    return data;
}