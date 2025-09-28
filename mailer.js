// mailer.js (Corrected with professional template)
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

const formatDetailsToHtml = (details) => {
    if (!details || details.length === 0) return '<li>No specific details available.</li>';
    return details.map(detail => {
        let color = '#374151'; // Gray-700
        if (detail.type === 'danger') color = '#DC2626'; // Red-600
        if (detail.type === 'warning') color = '#F59E0B'; // Amber-500
        return `<li style="color: ${color}; margin-bottom: 8px; font-size: 14px;">${detail.isCritical ? '<strong>CRITICAL: </strong>' : ''}${detail.text}</li>`;
    }).join('');
};

// CORRECTED: Added 'analysisType' parameter to the function
const sendHighRiskAlert = async (user, analysisResult, analysisType) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
        console.error('\x1b[31m[Mailer Error]:\x1b[0m Email credentials are not set in .env.');
        return;
    }
    
    const { score, details } = analysisResult;
    
    // CORRECTED: New professional email template
    const mailOptions = {
        from: `"FraudShield Security Alert" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `High-Risk Threat Detected in your recent ${analysisType} Analysis`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #be123c; color: white; padding: 24px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">High-Risk Security Alert</h1>
                </div>
                <div style="padding: 24px;">
                    <p style="font-size: 16px;">Hello ${user.full_name || 'User'},</p>
                    <p style="color: #4b5563;">
                        Our security engine detected a high-risk threat in a <strong>${analysisType}</strong> you submitted for analysis. Please review the details below and take immediate precautions.
                    </p>
                    
                    <div style="background-color: #fef2f2; border-left: 5px solid #be123c; padding: 16px; margin: 24px 0;">
                        <h2 style="margin-top: 0; margin-bottom: 8px; font-size: 18px;">Threat Score: <span style="color: #be123c; font-weight: bold;">${Math.round(score)} / 100</span></h2>
                        <p style="margin: 0; color: #991b1b;">This score indicates a high probability of malicious intent.</p>
                    </div>

                    <h3 style="border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; font-size: 18px; color: #111827;">Analysis Breakdown:</h3>
                    
                    <div style="padding: 8px 0;">
                        ${details.message && details.message.length > 0 ? `<h4>Message Analysis:</h4><ul style="list-style-type: none; padding-left: 0; margin-top: 8px;">${formatDetailsToHtml(details.message)}</ul>` : ''}
                        ${details.link && details.link.length > 0 ? `<h4>Link Analysis:</h4><ul style="list-style-type: none; padding-left: 0; margin-top: 8px;">${formatDetailsToHtml(details.link)}</ul>` : ''}
                    </div>

                    <h3 style="margin-top: 24px; border-bottom: 2px solid #f3f4f6; padding-bottom: 8px; font-size: 18px; color: #111827;">Recommended Actions:</h3>
                    <ul style="padding-left: 20px; color: #4b5563; font-size: 14px;">
                        <li><strong>Cease all interaction</strong> with the source of this content immediately.</li>
                        <li><strong>Do not click any links</strong> or provide any personal information.</li>
                        <li><strong>Delete the original message</strong> or email to prevent accidental exposure.</li>
                        <li>Consider <strong>blocking the sender</strong> or phone number.</li>
                    </ul>
                </div>
                <div style="background-color: #f9fafb; color: #6b7280; padding: 16px; text-align: center; font-size: 12px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0;">&copy; ${new Date().getFullYear()} FraudShield. All Rights Reserved.</p>
                    <p style="margin: 4px 0 0 0;">This is an automated security alert. You are receiving this because you have high-risk notifications enabled in your profile.</p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`\x1b[32m[Mailer Success]:\x1b[0m High-risk alert email sent to ${user.email}`);
    } catch (error) {
        console.error(`\x1b[31m[Mailer Error]:\x1b[0m Could not send email to ${user.email}.`);
        console.error("Full Error Details:", error);
    }
};

module.exports = {
    sendHighRiskAlert,
};