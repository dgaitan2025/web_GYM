import { useState, useMemo } from "react";
import Select from "react-select";
import { Outlet } from "react-router-dom"; // <-- aquí va Outlet
import {decryptString} from "../Funciones/Encriptar"
import "./VistaDashAdmin.css";

const opciones = [
    { value: "GraficoPie", label: "Clientes", roles: [1,2] },
    { value: "GrupoMuscular", label: "Grupo Muscular", roles: [1,4] },
    { value: "RutinasMusculos", label: "Grupo Rutinas", roles: [1,3] },

];

const VistaDashAdmin = () => {
    const [view, setView] = useState(null);

    const role = Number(decryptString(localStorage.getItem("tipoUser")));
    const opcionesVisibles = useMemo(() => {
        if (!role) return []; // sin rol, sin opciones
        return opciones.filter(d => !d.roles || d.roles.includes(role));
    }, [role]);


    return (
        <div className="dash-admin-container" >
            <Select classNamePrefix="DashAdmin"
                options={opcionesVisibles}
                placeholder="Selecciona un dashboard"
                menuPlacement="auto"      // voltea arriba/abajo según espacio
                menuPosition="fixed"      // evita cortes por overflow
                menuPortalTarget={document.body} // lo porta al <body>
                value={opciones.find(o => o.value === view) || null}
                onChange={(opt) => setView(opt?.value ?? null)}

            />
            <div className="dash-admin-content">
                <Outlet context={{ view }} />
            </div>


        </div>
    )
}

export default VistaDashAdmin;