import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password
    },
});

export const sendVerificationEmail = async (email, token) => {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.error('❌ GMAIL_USER or GMAIL_PASS is not defined in .env');
        throw new Error('Cấu hình email (GMAIL_USER/GMAIL_PASS) chưa hoàn tất. Vui lòng kiểm tra file .env.');
    }
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;
    
    const mailOptions = {
        from: `"GameHub" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Xác nhận tài khoản GameHub của bạn',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #38bdf8; text-align: center;">Chào mừng bạn đến với GameHub!</h2>
                <p>Cảm ơn bạn đã đăng ký. Vui lòng nhấn vào nút bên dưới để xác nhận tài khoản của mình:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" style="background-color: #38bdf8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Xác nhận ngay</a>
                </div>
                <p>Nếu nút không hoạt động, bạn có thể copy link sau vào trình duyệt:</p>
                <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999; text-align: center;">Đây là email tự động, vui lòng không phản hồi.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Verification email sent to:', email);
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        throw error;
    }
};
