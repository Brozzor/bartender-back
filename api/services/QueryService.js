const nodemailer = require("nodemailer");
const ejs = require("ejs");
module.exports = {
    sendMail: async (to, subject, template, data, attachement) => {
        if (!sails.config.tenant.smtpEnabled) return console.error("SMTP is not enabled")
        const smtpConfig = {
            host: sails.config.tenant.smtpHost,
            port: sails.config.tenant.smtpPort,
            secure: sails.config.tenant.smtpSecure, 
            auth: {
                user: sails.config.tenant.smtpUser,
                pass: sails.config.tenant.smtpPassword,
            },
        }
        if (!sails.config.tenant.smtpUser) delete smtpConfig.auth;

        let transporter = nodemailer.createTransport(smtpConfig)

        return new Promise((accept, reject) => {
            ejs.renderFile("./api/templates/mail/" + template + ".ejs", data, {}, async (err, html) => {
                if (err) return reject(err);
                let from = sails.config.tenant.url.toUpperCase() + ' <' + sails.config.tenant.smtpFrom + '>'

                let message = {
                    from: from,
                    to: to,
                    replyTo: sails.config.tenant.smtpFrom,
                    subject: subject,
                    html: html,
                }
                message.attachments = []
                if (attachement && attachement.length) {
                    for (const item of attachement) {
                        message.attachments.push({
                            filename: item.doc.name,
                            content: item.filestream
                        })
                    }
                } else if (attachement) {
                    message.attachments.push({
                        filename: attachement.doc.name,
                        content: attachement.filestream
                    })
                }
                try {
                    await transporter.sendMail(message);
                } catch (e) {
                    return reject(e);
                }
                accept()
            });

        })
    },
}