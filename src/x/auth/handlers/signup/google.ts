import Elysia from "elysia";
import { signupWithGooglelModelType } from "../../types";
import { signupWithGoogleService  } from "../../services/signup";

export const withGoogle = new Elysia()
    .use(signupWithGooglelModelType)
    .post('/google', async ({ set, body }) => {
        try {
            const data = await signupWithGoogleService(body)
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: data.message,
                data: {
                    cookies: {
                        ...data.cookies,
                        accessToken: await data.cookies?.accessToken,
                    }
                }
            }
        } catch (error) {
            return {
                success: false,
                code: 500,
                msg: error instanceof Error ? error.message : "Signup Failed"
            }
        }
    },
        {
            body: "auth.signup.google.body",
            response: "auth.signup.google.response"
        }
    );