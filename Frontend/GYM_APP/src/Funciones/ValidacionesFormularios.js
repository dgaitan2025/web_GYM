//Validaciones en tiempo real
import { cuiValido } from "../Funciones/validaDPI.js";
const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validarEdadMinima = (fechaISO, minAnios = 13) => {
    if (!fechaISO) return "La fecha es obligatoria";
    const hoy = new Date();
    const fechaNac = new Date(fechaISO);
    if (isNaN(fechaNac.getTime())) return "Fecha inválida";

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const cumpleEsteAño = new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate());
    if (hoy < cumpleEsteAño) edad -= 1;

    if (edad < minAnios) return `Debes tener al menos ${minAnios} años`;
    return null;
};

const validarCorreo = (correo) => {
    const correoTrim = (correo || "").trim();

    if (!correoTrim) return "El correo es obligatorio";

    if (!CORREO_REGEX.test(correoTrim)) {
        return "Formato de correo inválido";
    }

    return null; // ✅ válido
};

export function handleInputChange(e, formData, setFormData, errors, setErrors, setPreviewUrl) {

    const normalizarLetras = (v) => v.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    const normalizarTelefono = (v) => v.replace(/\D/g, "").slice(0, 8);
    const normalizarDPI = (v) => v.replace(/\D/g, "").slice(0, 13);
    const SOLO_LETRAS_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    // ------------ onChange con validaciones por campo ------------

    const { name, value, type, files } = e.target;
    const newErrors = { ...errors };

    // Nombre y Apellido
    if (name === "nombre" || name === "apellido") {
        const limpio = normalizarLetras(value);
        setFormData((p) => ({ ...p, [name]: limpio }));
        if (!limpio.trim()) newErrors[name] = `El ${name} es obligatorio`;
        else if (!SOLO_LETRAS_REGEX.test(limpio)) newErrors[name] = `El ${name} solo puede contener letras`;
        else delete newErrors[name];
        setErrors(newErrors);
        return;
    }

    // Teléfono
    if (name === "telefono") {
        const tel = normalizarTelefono(value);
        setFormData((p) => ({ ...p, telefono: tel }));
        if (tel.length !== 8) newErrors.telefono = "Debe contener exactamente 8 dígitos numéricos";
        else delete newErrors.telefono;
        setErrors(newErrors);
        return;
    }

    // DPI
    if (name === "dpi") {
        const dpi = normalizarDPI(value);
        setFormData((p) => ({ ...p, dpi }));
        const respuesta = cuiValido(dpi)
        if (!respuesta.valido) newErrors.dpi = { tipo: "error", mensaje: "El DPI no es válido" };
        else newErrors.dpi = { tipo: "ok", mensaje: `Departamento: ${respuesta.departamento}, Municipio: ${respuesta.municipio}` };
        setErrors(newErrors);
        return;
    }

    // Correo
    if (name === "correo") {
        setFormData((p) => ({ ...p, correo: value }));
        const err = validarCorreo(value);
        if (err) newErrors.correo = err;
        else delete newErrors.correo;
        setErrors(newErrors);
        return;
    }

    // Fecha
    if (name === "fechaNacimiento") {
        setFormData((p) => ({ ...p, fechaNacimiento: value }));
        const err = validarEdadMinima(value, 13);
        if (err) newErrors.fechaNacimiento = err;
        else delete newErrors.fechaNacimiento;
        setErrors(newErrors);
        return;
    }

    // Membresía
    if (name === "id_Sucursal") {
        setFormData((p) => ({ ...p, id_Sucursal: value }));
        if (!value) newErrors.id_Sucursal = "El ID de membresía es obligatorio";
        else delete newErrors.id_Sucursal;
        setErrors(newErrors);
        return;
    }

    if (name === "id_puesto") {
        setFormData((p) => ({ ...p, id_puesto: value }));
        if (!value) newErrors.id_puesto = "El puesto es obligatorio";
        else delete newErrors.id_puesto;
        setErrors(newErrors);
        return;
    }

    // Archivo (no se usa input file en este form, pero lo dejamos compatible)
    if (type === "file") {
        const file = files?.[0] || null;
        setFormData((p) => ({ ...p, foto: file }));
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
        return;
    }

    // Genérico
    setFormData((p) => ({ ...p, [name]: value }));

}

export function validateForm(formData, setErrors) {

    const newErrors = {};

    // Nombre / Apellido
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    else if (!SOLO_LETRAS_REGEX.test(formData.nombre)) newErrors.nombre = "El nombre solo puede contener letras";

    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
    else if (!SOLO_LETRAS_REGEX.test(formData.apellido)) newErrors.apellido = "El apellido solo puede contener letras";

    // Teléfono
    if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";
    else if (!/^\d{8}$/.test(formData.telefono)) newErrors.telefono = "Debe contener exactamente 8 dígitos numéricos";

    // DPIf
    const dpi = (formData.dpi || "").trim();
    if (!dpi) newErrors.dpi = "El DPI es obligatorio";

    else if (!cuiValido(dpi)) newErrors.dpi = "El DPI no es válido";

    // Fecha
    const errFecha = validarEdadMinima(formData.fechaNacimiento, 13);
    if (errFecha) newErrors.fechaNacimiento = errFecha;

    // Correo
    const errCorreo = validarCorreo(formData.correo);
    if (errCorreo) newErrors.correo = errCorreo;

    // Membresía
    if (!String(formData.id_Sucursal || "").trim()) {
        newErrors.id_Sucursal = "El ID de membresía es obligatorio";
    }

    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;




}