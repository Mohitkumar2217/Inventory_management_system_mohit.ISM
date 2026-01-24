import nodemailer from "nodemailer";

export const sendCredentialsEmail = async (user, warehouseName) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your SMTP provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"Logistics System" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Action Required: Warehouse Admin Appointment",
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #4f46e5;">Portal Access Granted</h2>
                <p>Hello <b>${user.name}</b>,</p>
                <p>You have been officially appointed as the Administrator for <b>${warehouseName}</b>.</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p><b>Your Access Credentials:</b></p>
                <p><b>Portal URL:</b> <a href="https://your-warehouse-portal.com">Login Here</a></p>
                <p><b>Username:</b> ${user.email}</p>
                <p><b>Temporary Password:</b> [Your system password]</p>
                <p style="font-size: 12px; color: #666; margin-top: 20px;">
                    Note: If you do not have a password set, please use the 'Forgot Password' link on the login page.
                </p>
            </div>
        `,
    };

    return await transporter.sendMail(mailOptions);
};