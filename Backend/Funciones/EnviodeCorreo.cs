using Api_Empleados.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.IO;    

namespace Api_Empleados.Funciones
{
    public class EnviodeCorreo
    {
        public async Task EnviarCorreo(JsonElement root, string correo, string nombre, string apellido, int tipo_usuario)
        {
            try
            {
                //Armop esta variable uniamente con un no0mbre y apellido (en caso tuviera mas de uno) si quiero poner todo solo concateno variables
                string nombre_persona = (nombre.Split(' ')[0]) + " " + (apellido.Split(' ')[0]);
                //Armo la ruta hacia la plantilla para enviarla a la funcion para colocar el resto de elemento encima
                var rutaPlantilla = Path.Combine("Recursos", "img", "Plantilla.png");
                //Instancio la funcion para crear el carnet
                var carnetGen = new CarnetGenerador();

                //Extraigo el contenido de la estructura del Json
                string usuario = root.GetProperty("usuario").GetString();
                string contraseña = root.GetProperty("contraseña").GetString();


                //Asigno el valor de retorno (el pdf) para enviarlo al correo
                var pdf = carnetGen.GenerarCarnetConPlantilla(
                    nombre_persona,
                    usuario,
                    rutaPlantilla
                );
                //Guardo el PDF en el server
                var rutaPdf = Path.Combine("Recursos", "pdfs");
                Directory.CreateDirectory(rutaPdf);
                //Asigno nombre al pdf (uso el nombre de usuario ya que es unico y si en algun momento se debe actualizar la plantilla se sobreescribe buscnado el nombre)
                string fileName = $"{usuario}.pdf";
                //Armo la ruta completa donde se guardara el pdf creado
                string fullPath = Path.Combine(rutaPdf, fileName);
                //Escribo el pdf en la direccion asignada
                await File.WriteAllBytesAsync(fullPath, pdf);


                //Instancio y mando las variables para el envio del correo
                var emailservice = new EmailService();
                await emailservice.EnviarCorreoConPDF(correo, nombre_persona, usuario, contraseña, tipo_usuario, pdf);
            }
            catch (Exception ex)
            {
                // Manejar la excepción (por ejemplo, registrar el error)
                throw new InvalidOperationException("Error inesperado en Envio de Correo", ex);
            }
        }
    }
}
