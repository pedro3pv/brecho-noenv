const nodemailer = require('nodemailer');

async function sendNotificationEmail(email, count) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: `Tem ${count} Notificações`,
        html: generateNotificationEmailHtml(count)
    };

    await transporter.sendMail(mailOptions);
}

function generateNotificationEmailHtml(count) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f6f6f6;
                }
                .email-container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
                }
                .email-content {
                    line-height: 1.5;
                    color: #333333;
                }
                .email-button {
                    display: inline-block;
                    background-color: #3498db;
                    color: #ffffff;
                    padding: 12px 24px;
                    margin: 20px 0;
                    text-decoration: none;
                    border-radius: 3px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h2>Notificações de Conversas</h2>
                <p class="email-content">Você tem ${count} ${count == 1 ? "nova notificação" : "novas notificações"} notificações em suas conversas. Por favor, faça login para acessá-las:</p>
                <a href="${process.env.CLIENT_URL}/user/mychats" class="email-button">Acessar Conversas</a>
            </div>
        </body>
        </html>`;
}

module.exports = { sendNotificationEmail };