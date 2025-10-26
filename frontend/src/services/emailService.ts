
import emailjs from '@emailjs/browser';

export const sendEmailService = async (formElement: HTMLFormElement) => {
  try {
    await emailjs.sendForm(
      "service_86gb92g",
      "template_79fg633",
      formElement,
      "SiC6YxyJOy4p5Hlqs"
    );
    return { success: true };
  } catch (error: any) {
    console.error("FAILED...", error?.text || error);
    return { success: false, error };
  }
};
