import nodeMailer from 'nodemailer';

export const sendEmail = async (options) => {
//   const transport = nodeMailer.createTransport({
//     service: process.env.SMPT_SERVICE,
//     host: 'smtp.gmail.com',
//     port: 465,
//     auth: {
//       user: process.env.SMPT_MAIL,
//       pass: process.env.SMPT_PASSWORD,
//     },
//   });

    const transport = nodeMailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "62926499203506",
        pass: "e2a440d6a4d52c"
      }
    });
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transport.sendMail(mailOptions);
};
