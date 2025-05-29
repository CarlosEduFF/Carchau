import { send, EmailJSResponseStatus } from '@emailjs/browser';
import emailKey from '../config/emailJS';

export const sendEmail = async (email: string, mensagem: string) => {
    if (!mensagem.trim()) {
        throw new Error('Por favor, preencha o campo antes de enviar.');
    }

    try {
        const response = await send(
            emailKey.EMAIL_SERVICE_ID, 
            emailKey.EMAIL_TEMPLATE_ID,
            {
                message: `De: ${email}, Mensagem: ${mensagem}`
            },
            {
                publicKey: emailKey.EMAIL_PUBLIC_KEY,
            },
        );

        return response;
    } catch (err) {
        if (err instanceof EmailJSResponseStatus) {
            console.error('EmailJS Request Failed...', err);
            throw new Error('Falha no envio do email.');
        } else {
            throw err;
        }
    }
};
