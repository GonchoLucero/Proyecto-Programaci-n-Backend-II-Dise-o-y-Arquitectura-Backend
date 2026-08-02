import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: Number(env.MAIL_PORT) || 587,
    secure: Number(env.MAIL_PORT) === 465,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
    },
});

export async function sendTicketConfirmationEmail({
    to,
    userName,
    eventTitle,
    eventDate,
    quantity,
    reservationCode,
}) {
    try {
        await transporter.sendMail({
            from: env.MAIL_FROM,
            to,
            subject: `Inscripción confirmada: ${eventTitle}`,
            html: `
                <h2>¡Inscripción confirmada!</h2>
                <p>Hola ${userName},</p>
                <p>Tu inscripción a <strong>${eventTitle}</strong> quedó confirmada.</p>
                <ul>
                    <li><strong>Fecha del evento:</strong> ${new Date(eventDate).toLocaleDateString('es-AR')}</li>
                    <li><strong>Cantidad de entradas:</strong> ${quantity}</li>
                    <li><strong>Código de reserva:</strong> ${reservationCode}</li>
                </ul>
                <p>¡Nos vemos ahí!</p>
            `,
        });
    } catch (error) {
        console.error('No se pudo enviar el email de confirmación:', error.message);
    }
}
