import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

console.log('📧 Starting Email Test...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not Set');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Connection Failed:', error.message);
  } else {
    console.log('✅ Gmail Connection Successful! Sending test email...');

    // Send Test Email
    transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: '✅ EMS Email Test - Successful!',
      html: `
        <div style="font-family:Arial,sans-serif;padding:30px;background:#f1f5f9;">
          <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;padding:30px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
            <h2 style="color:#4f46e5;">🎉 Email Test Successful!</h2>
            <p style="color:#475569;">Your EMS Portal Email System is functioning properly!</p>
            <hr style="border:1px solid #e2e8f0;margin:20px 0;">
            <p style="color:#64748b;font-size:13px;">📅 Test Time: ${new Date().toLocaleString('en-US')}</p>
          </div>
        </div>
      `
    }, (err, info) => {
      if (err) {
        console.error('❌ Error sending email:', err.message);
      } else {
        console.log('🎉 Email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log(`📥 Please check the inbox of ${process.env.EMAIL_USER}!`);
      }
    });
  }
});
