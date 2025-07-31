using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace Api_Empleados.Funciones
{
    public class EmailService
    {
        public async Task EnviarCorreoConPDF(string correoDestino, string Nombre, string nombreUsuario, string contraseña, int idtipousuario, byte[] pdf)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Gym Las Brisas", "rdra20.ies@gmail.com")); // Cambiar
            message.To.Add(new MailboxAddress(nombreUsuario, correoDestino));
            message.Subject = "Habilitación de usuario";
            //Creo el mensaje en variables
            string mensaje_principal, mensaje_credenciales, mensaje_adicional;

            mensaje_principal = idtipousuario == 4 ? $"Bienvenido {Nombre}, te enviamos las credenciales de tu usuario para que puedas acceder a la plataforma."
                                                : $"Bienvenido {Nombre}, nos alegra que te integres al equipo de Gym Las Brisas. Adjuntamos tus credenciales para que puedas acceder a la plataforma.";

            mensaje_credenciales = $"\n\nUsuario: {nombreUsuario}\nContraseña: {contraseña}";
            mensaje_adicional = "\n\nTambién hacemos el envío de tu carnet de registro para que puedas ingresar a nuestras instalaciones." +
                                "\n\nPor favor, cambia tu contraseña al ingresar por primera vez y no compartas tus credenciales con nadie.";


            //Construyo el cuerpo del correo con el BOdyBuilder y concateno los mensajes anteriores
            var builder = new BodyBuilder
            {
                TextBody = mensaje_principal + mensaje_credenciales + mensaje_adicional,
            };

            //Agrego el Carnet
            builder.Attachments.Add("CarnetUsuario.pdf", pdf, new ContentType("application", "pdf"));
            message.Body = builder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync("rdra20.ies@gmail.com", "sjammhmtreziblfp");
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }
    }
}
