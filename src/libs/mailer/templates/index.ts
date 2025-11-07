export * from './prepareEmailTemplate'


export function replaceTemplateVariables(
  template: string,
  variables: Record<string, string | number | undefined>
): string {
  if (typeof template !== "string") {
    console.error("Template is not a string");
    return "";
  }
  return Object.entries(variables).reduce((acc, [key, value]) => {
    if (value === undefined) {
      console.warn(`Variable ${key} is undefined`);
      return acc;
    }
    return acc.replace(new RegExp(`%${key}%`, "g"), String(value));
  }, template);
}

/// Email template processor
export async function fetchAndProcessEmailVerification(
  { TOKEN, EMAIL_TYPE, NICK_NAME, CREATED_AT, LAST_LOGIN }: {
    TOKEN: string;
    EMAIL_TYPE: string,
    NICK_NAME?: string;
    CREATED_AT?: string;
    LAST_LOGIN?: string
  }
): Promise<{
  processedTemplate: string;
  processedSubject: string;
}> {
  try {
    let subject: string
    let emailBody: string
    const encodedToken = encodeURIComponent(TOKEN);

    switch (EMAIL_TYPE) {
      case 'EmailVerification': {
        subject = 'Verify your email address'
        emailBody = EmailVerificationBody(encodedToken)
        break
      }
      case 'PasswordReset': {
        subject = 'Verify your password reset request'
        emailBody = resetPasswordEmailBody(encodedToken)
        break
      }
      case 'OTPTokenVerification': {
        subject = 'Verify One-Time Password (OTP) to complete your login'
        emailBody = mfaOtpEmailBody(TOKEN)
        break
      }
      default: {
        throw new Error(`Unknown EMAIL_TYPE: ${EMAIL_TYPE}`);
      }
    }

  const variables = {
      NICK_NAME: NICK_NAME || "User",
      CREATED_AT,
      LAST_LOGIN,
    };

    const processedTemplate = replaceTemplateVariables(emailBody, variables);
    const processedSubject = replaceTemplateVariables(subject, variables);

    return { processedTemplate, processedSubject };
  } catch (error) {
    console.error("Email template processing failed", error);
    throw error;
  }
}


const mfaOtpEmailBody = (TOKEN:string) => `
  <p>Hello %NICK_NAME%,</p>
  <p>We received a request to log in to your Ombaro account. Please use the following One-Time Password (OTP) to complete your login:</p>

  <p style="text-align:center; font-size:22px; font-weight:bold; letter-spacing:4px; margin:20px 0;">
    ${TOKEN}
  </p>

  <p>This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
  <p>If you did not attempt to log in, please secure your account immediately by changing your password.</p>
`;

const resetPasswordEmailBody = (encodedToken: string) => `
  <p>Hello %NICK_NAME%,</p>
  <p>You recently requested to reset your password. Click the button below to proceed:</p>
  
  <p style="text-align:center;">
    <a href="https://ombaro.com/reset?token=${encodedToken}"
       style="display:inline-block; background:#E63946; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none !important; font-weight:bold;">
      Reset Password
    </a>
  </p>

  <p><strong>Last login:</strong>%LAST_LOGIN%</p>

  <p>If you did not request a password reset, you can safely ignore this email.</p>
`;

const EmailVerificationBody = (encodedToken: string) => `
      <p>Hello %NICK_NAME%,</p>
      <p>Thank you for signing up on <strong>%CREATED_AT%</strong>. 
      Please verify your email address by clicking the button below:</p>
      <p style="text-align:center;">
        <a href="https://ombaro.com/verify?token=${encodedToken}"
           style="display:inline-block; background:#595acc; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none !important; font-weight:bold;">
          Verify Email
        </a>
      </p>
      <p>If you didn’t create an account, you can safely ignore this email.</p>
    
  `;
