
export const verifyRecaptcha = async (token: string): Promise<boolean> => {
    const secretKey = process.env.OMBARO_GOOGLE_RECAPTCHA_SECRET_KEY!;
    const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${secretKey}&response=${token}`,
        }
    );

    const data = await response.json();
    return data.success;
}