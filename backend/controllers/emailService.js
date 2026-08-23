import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Gmail Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// =============================================
// 1. Employee Welcome Email
// =============================================
export const sendWelcomeEmail = async ({ name, email, password, department, designation }) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;padding:30px 15px;}
    .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);}
    .head{background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 40px;text-align:center;}
    .head h1{color:#fff;font-size:26px;font-weight:800;margin-top:10px;}
    .head p{color:rgba(255,255,255,0.8);font-size:14px;margin-top:6px;}
    .logo{display:inline-block;background:rgba(255,255,255,0.15);padding:10px 22px;border-radius:10px;color:#fff;font-size:20px;font-weight:800;}
    .body{padding:36px 40px;}
    .hi{font-size:18px;font-weight:700;color:#0f172a;margin-bottom:12px;}
    .msg{font-size:14px;color:#475569;line-height:1.7;margin-bottom:24px;}
    .creds{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:22px;margin-bottom:24px;}
    .creds-title{font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px;}
    .cred-table{width:100%;border-collapse:collapse;}
    .cred-table td{padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;vertical-align:middle;}
    .cred-table tr:last-child td{border-bottom:none;}
    .lbl{color:#64748b;font-weight:600;width:110px;}
    .val{font-weight:700;color:#0f172a;background:#eef2ff;padding:3px 10px;border-radius:6px;}
    .cards{width:100%;border-collapse:collapse;margin-bottom:24px;}
    .cards td{width:50%;padding:6px;vertical-align:top;}
    .card{background:#f8fafc;border-radius:10px;padding:14px;border:1px solid #e2e8f0;}
    .card .icon{font-size:20px;margin-bottom:6px;}
    .card .clbl{font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:700;}
    .card .cval{font-size:13px;color:#0f172a;font-weight:700;margin-top:3px;}
    .btn-wrap{text-align:center;margin-bottom:24px;}
    .btn{display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;}
    .foot{background:#f8fafc;padding:22px 40px;text-align:center;border-top:1px solid #e2e8f0;}
    .foot p{font-size:12px;color:#94a3b8;line-height:1.6;}
    .foot strong{color:#4f46e5;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <div class="logo">🏢 EMS Portal</div>
      <h1>Welcome to the Team! 🎉</h1>
      <p>Your employee account has been successfully created</p>
    </div>
    <div class="body">
      <div class="hi">Hello, ${name}! 👋</div>
      <div class="msg">
        We are thrilled to have you on board! Your Employee Management System (EMS) account is now ready.
        Use the credentials below to login and access your personal dashboard.
      </div>
      <div class="creds">
        <div class="creds-title">🔑 Your Login Credentials</div>
        <table class="cred-table">
          <tr>
            <td class="lbl">📧 Email</td>
            <td><span class="val">${email}</span></td>
          </tr>
          <tr>
            <td class="lbl">🔒 Password</td>
            <td><span class="val">${password}</span></td>
          </tr>
        </table>
      </div>
      <table class="cards">
        <tr>
          <td>
            <div class="card">
              <div class="icon">🏛️</div>
              <div class="clbl">Department</div>
              <div class="cval">${department || 'Information Technology'}</div>
            </div>
          </td>
          <td>
            <div class="card">
              <div class="icon">💼</div>
              <div class="clbl">Designation</div>
              <div class="cval">${designation || 'Associate Engineer'}</div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="card">
              <div class="icon">📅</div>
              <div class="clbl">Joining Date</div>
              <div class="cval">${new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
            </div>
          </td>
          <td>
            <div class="card">
              <div class="icon">🛡️</div>
              <div class="clbl">Role</div>
              <div class="cval">Employee</div>
            </div>
          </td>
        </tr>
      </table>
      <div class="btn-wrap">
        <a href="http://localhost:3000" class="btn">🚀 Login to EMS Portal</a>
      </div>
      <div class="msg" style="font-size:12px;color:#94a3b8;text-align:center;">
        ⚠️ Please keep your credentials safe. Do not share them with anyone.
      </div>
    </div>
    <div class="foot">
      <p>This is an automated email from <strong>EMS Portal</strong><br>
      Employee Management System | Diploma in Computer Engineering (CO5K)<br>
      Developed by <strong>Dhanaraj Patil</strong></p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '✅ Welcome to EMS Portal - Your Account is Ready!',
    html
  });

  console.log(`✅ Welcome email sent to: ${email}`);
};

// =============================================
// 2. Admin Notification Email
// =============================================
export const sendAdminNotificationEmail = async ({ name, email, department, designation }) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;padding:30px 15px;}
    .wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);}
    .head{background:linear-gradient(135deg,#0f172a,#1e293b);padding:30px 40px;text-align:center;}
    .head h1{color:#fff;font-size:22px;font-weight:700;}
    .head p{color:#94a3b8;font-size:13px;margin-top:6px;}
    .body{padding:32px 40px;}
    .alert-table{width:100%;border-collapse:collapse;background:#eef2ff;border:1px solid #c7d2fe;border-radius:12px;margin-bottom:22px;}
    .alert-table td{padding:18px;vertical-align:middle;}
    .alert-icon{font-size:32px;width:50px;}
    .alert-text h3{font-size:15px;color:#4f46e5;font-weight:700;}
    .alert-text p{font-size:13px;color:#64748b;margin-top:4px;}
    .details{background:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e2e8f0;}
    .drow{width:100%;border-collapse:collapse;}
    .drow td{padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;}
    .drow tr:last-child td{border-bottom:none;}
    .dlbl{color:#64748b;font-weight:600;}
    .dval{color:#0f172a;font-weight:700;text-align:right;}
    .foot{background:#f8fafc;padding:18px 40px;text-align:center;border-top:1px solid #e2e8f0;}
    .foot p{font-size:12px;color:#94a3b8;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <h1>🔔 New Employee Registration Alert</h1>
      <p>EMS Portal — Admin Notification System</p>
    </div>
    <div class="body">
      <table class="alert-table">
        <tr>
          <td class="alert-icon">👤</td>
          <td class="alert-text">
            <h3>New Employee Joined!</h3>
            <p>A new employee has successfully registered on the EMS Portal.</p>
          </td>
        </tr>
      </table>
      <div class="details">
        <table class="drow">
          <tr><td class="dlbl">👤 Full Name</td><td class="dval">${name}</td></tr>
          <tr><td class="dlbl">📧 Email</td><td class="dval">${email}</td></tr>
          <tr><td class="dlbl">🏛️ Department</td><td class="dval">${department || 'Information Technology'}</td></tr>
          <tr><td class="dlbl">💼 Designation</td><td class="dval">${designation || 'Associate Engineer'}</td></tr>
          <tr><td class="dlbl">📅 Registered On</td><td class="dval">${new Date().toLocaleString('en-US')}</td></tr>
        </table>
      </div>
    </div>
    <div class="foot">
      <p>EMS Portal — Admin Notification | Employee Management System</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_USER,
    subject: `🔔 New Employee Registered: ${name}`,
    html
  });

  console.log(`✅ Admin notification email sent successfully!`);
};

// =============================================
// 3. User Login Success Email
// =============================================
export const sendLoginSuccessEmail = async ({ name, email, role }) => {
  const loginTime = new Date().toLocaleString('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  const isAdmin = role === 'admin';
  const roleLabel = isAdmin ? '👑 Admin' : '👤 Employee';
  const avatarBg = isAdmin ? '#4f46e5' : '#059669';
  const avatarIcon = isAdmin ? '👑' : '👤';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; padding: 30px 15px; }
    .wrap { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
    .head { background: linear-gradient(135deg, #059669, #10b981); padding: 40px 40px 64px; text-align: center; }
    .logo { display: inline-block; background: rgba(255,255,255,0.18); padding: 10px 22px; border-radius: 10px; color: #fff; font-size: 18px; font-weight: 800; margin-bottom: 14px; }
    .head h1 { color: #fff; font-size: 24px; font-weight: 800; }
    .head p { color: rgba(255,255,255,0.85); font-size: 13px; margin-top: 6px; }
    .avatar-wrap { text-align: center; margin-top: -44px; margin-bottom: 16px; }
    .avatar { width: 82px; height: 82px; border-radius: 50%; background: ${avatarBg}; display: inline-block; font-size: 38px; line-height: 82px; border: 4px solid #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.15); text-align: center; }
    .body { padding: 8px 36px 36px; }
    .emp-name { font-size: 20px; font-weight: 800; color: #0f172a; text-align: center; margin-bottom: 6px; }
    .badge { display: inline-block; background: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; padding: 4px 16px; border-radius: 20px; margin-bottom: 18px; }
    .msg { font-size: 14px; color: #475569; line-height: 1.7; text-align: center; margin-bottom: 24px; }
    .info-box { width: 100%; border-collapse: collapse; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; margin-bottom: 22px; }
    .info-box td { padding: 13px 18px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    .info-box tr:last-child td { border-bottom: none; }
    .td-icon { width: 42px; font-size: 20px; text-align: center; }
    .td-label { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block; }
    .td-value { font-size: 14px; color: #0f172a; font-weight: 700; display: block; margin-top: 2px; }
    .warn-box { width: 100%; border-collapse: collapse; background: #fef9c3; border: 1px solid #fde047; border-radius: 12px; margin-bottom: 22px; }
    .warn-box td { padding: 14px 18px; vertical-align: top; font-size: 13px; color: #854d0e; line-height: 1.6; }
    .warn-icon { width: 32px; font-size: 20px; }
    .btn-wrap { text-align: center; padding-bottom: 8px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: #fff; text-decoration: none; padding: 15px 42px; border-radius: 12px; font-size: 15px; font-weight: 700; }
    .foot { background: #f8fafc; padding: 22px 36px; text-align: center; border-top: 1px solid #e2e8f0; }
    .foot p { font-size: 12px; color: #94a3b8; line-height: 1.8; }
    .foot strong { color: #059669; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <div class="logo">🏢 EMS Portal</div>
      <h1>Login Successful! ✅</h1>
      <p>Your EMS account was accessed just now</p>
    </div>
    <div class="avatar-wrap">
      <div class="avatar">${avatarIcon}</div>
    </div>
    <div class="body">
      <div style="text-align:center;margin-bottom:20px;">
        <div class="emp-name">${name}</div>
        <div class="badge">${roleLabel}</div>
      </div>
      <div class="msg">
        A successful login was recorded for your EMS Portal account.<br>
        If this was you, no action is needed. Stay secure! 🔐
      </div>
      <table class="info-box">
        <tr>
          <td class="td-icon">👤</td>
          <td><span class="td-label">Full Name</span><span class="td-value">${name}</span></td>
        </tr>
        <tr>
          <td class="td-icon">📧</td>
          <td><span class="td-label">Email Address</span><span class="td-value">${email}</span></td>
        </tr>
        <tr>
          <td class="td-icon">${avatarIcon}</td>
          <td><span class="td-label">Account Role</span><span class="td-value">${roleLabel}</span></td>
        </tr>
        <tr>
          <td class="td-icon">🕐</td>
          <td><span class="td-label">Login Time</span><span class="td-value">${loginTime}</span></td>
        </tr>
      </table>
      <table class="warn-box">
        <tr>
          <td class="warn-icon">⚠️</td>
          <td>If you did not perform this login, please contact your admin immediately or reset your password right away.</td>
        </tr>
      </table>
      <div class="btn-wrap">
        <a href="http://localhost:3000" class="btn">🚀 Go to EMS Dashboard</a>
      </div>
    </div>
    <div class="foot">
      <p>This is an automated security email from <strong>EMS Portal</strong><br>
      Employee Management System | Diploma in Computer Engineering (CO5K)<br>
      Developed by <strong>Dhanaraj Patil</strong></p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `✅ EMS Portal - Login Successful | ${new Date().toLocaleDateString('en-US')}`,
    html
  });

  console.log(`✅ Login Success email sent to: ${email}`);
};
