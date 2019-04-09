  var nodemailer = require('nodemailer');
  var htmlTemplates = require('../constants/htmlTemplateForEmail');

  const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  var transporter = nodemailer.createTransport({
    host: "smtp.google.com",
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD
    }
  });

exports.contactUsMessage = async function(req, res, next) {
        console.log("INFO SENDED");
        console.log('body');
        console.log(req.body);
        
        try {

          const subject = "<h4>Subject: " + req.body.subject + "</h4>";
          const email = "<p>Email of sender:  " + req.body.email + "</p>";
          const fullName = "<p>Full name:  " + req.body.fullName + "</p>";
          const message = "<p>Message:  " + req.body.message + "</p>";

          const msg = {
            to: 'kolodkomaxim@gmail.com',
            from: 'ContactUs@letsrun.com',
            subject: req.body.subject,
            text: 'contact us form',
            // attachments: [
            //   {
            //     content: 'public/images/flogo-HexRBG-Wht-58.png',
            //     filename: 'flogo-HexRBG-Wht-58.png',
            //     // type: 'image/png',
            //     // disposition: 'attachment',
            //     // content_id: 'facebook@logo'
            //   },
            // ],
            html: htmlTemplates.htmlEmailTemplate.header  +
            email +
            fullName +
            subject +
            message + 
           htmlTemplates.htmlEmailTemplate.footer
          };
      
          sgMail.send(msg);

            // const subject = "<h4>Subject: " + req.body.subject + "</h4>";
            // const email = "<p>Email of sender:  " + req.body.email + "</p>";
            // const fullName = "<p>Full name:  " + req.body.fullName + "</p>";
            // const message = "<p>Message:  " + req.body.message + "</p>";
            // const emailToSend = {
            //     from: '"LetsRun" <events@letsrun.com>',
            //     to: "kolodkomaxim@gmail.com",
            //     subject: req.body.subject,
            //     text: "contact us form",
            //     attachments: htmlTemplates.htmlEmailTemplate.attachmentsTemplate,
            //     html: htmlTemplates.htmlEmailTemplate.header  +
            //     email +
            //     fullName +
            //     subject +
            //     message + 
            //    htmlTemplates.htmlEmailTemplate.footer
            //   };
    
            //   transporter.sendMail(emailToSend, function (err, info) {
            //     if (err)
            //       console.log(err)
            //     else
            //       console.log(info);
            //   });

              res.status(201).json({
                message: 'email send'
              });

        } catch(error) {
            next(error);
        }
}