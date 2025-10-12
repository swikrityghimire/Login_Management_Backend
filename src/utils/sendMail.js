import nodemailer from "nodemailer";

let transporterInfo = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "swikrityghimire@gmail.com",
    pass: "apzc xqhe mdzr wsxv",
  },
};

export let sendEmail = async (mailInfo) => {
  try {
    let transporter = nodemailer.createTransport(transporterInfo);
    let info = await transporter.sendMail(mailInfo);
  } catch (error) {
    console.log("Error has occured", error.message);
  }
};
