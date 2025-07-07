const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const message = {
      from: `${process.env.EMAIL_FROM} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Email could not be sent');
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  const message = `Chào mừng ${name} đến với JINZMedia!\n\nTài khoản của bạn đã được tạo thành công.\n\nCảm ơn bạn đã tham gia!`;
  
  const html = `
    <h2>Chào mừng ${name} đến với JINZMedia!</h2>
    <p>Tài khoản của bạn đã được tạo thành công.</p>
    <p>Cảm ơn bạn đã tham gia!</p>
  `;

  const options = {
    email,
    subject: 'Chào mừng đến với JINZMedia',
    message,
    html
  };

  await sendEmail(options);
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetUrl = `${process.env.BASE_URL}/api/auth/resetpassword/${resetToken}`;
  
  const message = `Xin chào ${name},\n\nBạn đã yêu cầu đặt lại mật khẩu. Vui lòng truy cập liên kết sau để đặt lại mật khẩu:\n\n${resetUrl}\n\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\nLiên kết này sẽ hết hạn sau 10 phút.`;
  
  const html = `
    <h2>Đặt lại mật khẩu</h2>
    <p>Xin chào ${name},</p>
    <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
    <p>Hoặc copy và paste liên kết sau vào trình duyệt:</p>
    <p>${resetUrl}</p>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    <p><strong>Lưu ý:</strong> Liên kết này sẽ hết hạn sau 10 phút.</p>
  `;

  const options = {
    email,
    subject: 'Đặt lại mật khẩu JINZMedia',
    message,
    html
  };

  await sendEmail(options);
};

// Send password reset confirmation email
const sendPasswordResetConfirmation = async (email, name) => {
  const message = `Xin chào ${name},\n\nMật khẩu của bạn đã được đặt lại thành công.\n\nNếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.`;
  
  const html = `
    <h2>Mật khẩu đã được đặt lại</h2>
    <p>Xin chào ${name},</p>
    <p>Mật khẩu của bạn đã được đặt lại thành công.</p>
    <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
  `;

  const options = {
    email,
    subject: 'Mật khẩu đã được đặt lại - JINZMedia',
    message,
    html
  };

  await sendEmail(options);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmation
}; 