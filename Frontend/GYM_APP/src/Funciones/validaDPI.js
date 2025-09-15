/**
 * @param {string} cui - número de DPI
 * @returns {boolean} true para CUI válido y false para CUI no válido
 */
import {depMuni} from "./DepMuni"

export const cuiValido = (cui) => {
  

  if (!cui) return false;

  const cuiRegExp = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/;
  if (!cuiRegExp.test(cui)) return { valido: false, departamento: null, municipio: null };

  // elimina TODOS los espacios (antes quitabas solo el primero)
  cui = cui.replace(/\s/g, "");

  const depto = parseInt(cui.substring(9, 11), 10);
  const muni = parseInt(cui.substring(11, 13), 10);
  const numero = cui.substring(0, 8);
  const verificador = parseInt(cui.substring(8, 9), 10);

  const munisPorDepto = [
    17, 8, 16, 16, 13, 14, 19, 8, 24, 21, 9, 30, 32, 21, 8, 17, 14, 5, 11, 11, 7, 17,
  ];

  if (depto === 0 || muni === 0) return { valido: false, departamento: null, municipio: null };
  if (depto > munisPorDepto.length) return { valido: false, departamento: null, municipio: null };
  if (muni > munisPorDepto[depto - 1]) return { valido: false, departamento: null, municipio: null };

  // Algoritmo complemento 11
  let total = 0;
  for (let i = 0; i < numero.length; i++) {
    total += Number(numero[i]) * (i + 2);
  }
  const modulo = total % 11;
  const valido = modulo === verificador;

  const departamento = depMuni [depto - 1]?.nombre || null;
  const municipio = depMuni [depto - 1]?.municipios[muni - 1] || null;

  return { valido, departamento, municipio};
};

/**
 * @param {string} nit - número de NIT
 * @returns {boolean} true para NIT válido y false para NIT no válido
 */
export const nitValido = (nit) => {
  if (!nit) return false;

  const nitRegExp = /^[0-9]+(-?[0-9kK])?$/;
  if (!nitRegExp.test(nit)) return false;

  nit = nit.replace(/-/, "");
  const lastChar = nit.length - 1;
  const number = nit.substring(0, lastChar);
  const expectedChecker = nit.substring(lastChar).toLowerCase();

  let factor = number.length + 1;
  let total = 0;

  for (let i = 0; i < number.length; i++) {
    const digit = parseInt(number[i], 10);
    total += digit * factor;
    factor -= 1;
  }

  const modulus = (11 - (total % 11)) % 11;
  const computedChecker = modulus === 10 ? "k" : String(modulus);

  return expectedChecker === computedChecker;
};
