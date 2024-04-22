const nodemailer = require("nodemailer");


//the data parameter should come first in the function
  const sendEmail = async (data,req, res) => {
    try {
      const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  
  
      const info = await transporter.sendMail({
          from: `Hey , ${process.env.EMAIL}`,
          to: "mesfintdev@gmail.com",
          subject:data.subject,
          text:data.text,
          html:data.htm
        });
        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ message: "Email sent" });
      
    } catch (error) {
      
      res.status(400).json({ message: "Error sending email" });
    }

    
    
  }

  module.exports = { sendEmail };