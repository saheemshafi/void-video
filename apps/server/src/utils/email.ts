import nodemailer from 'nodemailer';
import { APP_NAME } from '../constants';
import createEmailTemplate from './create-email-template';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
  from: `${APP_NAME} <${process.env.EMAIL_ADDRESS}>`,
});

export const sendPasswordResetEmail = async (to: string, data: any) => {
  try {
    if (![to, data.resetLink, data.avatar, data.username].every(Boolean)) {
      throw new Error('EMAIL: All fields are required.');
    }

    const html = await createEmailTemplate('password-reset-link.ejs', data);

    const emailResponse = await transporter.sendMail({
      to,
      subject: 'Void Video - Password Reset',
      html,
    });

    return emailResponse;
  } catch (error) {
    console.log('NODEMAILER: Email failed to sent ', error);
    throw error;
  }
};

export const sendPasswordResetSuccessEmail = async (to: string, data: any) => {
  try {
    if (!to || !data.username || !data.avatar) {
      throw new Error('EMAIL: All fields required.');
    }

    const html = await createEmailTemplate('password-reset-success.ejs', data);

    const emailResponse = await transporter.sendMail({
      to,
      subject: 'Void Video - Password Reset Success',
      html,
    });

    return emailResponse;
  } catch (error) {
    console.log('NODEMAILER: Email failed to sent ', error);
    throw error;
  }
};
