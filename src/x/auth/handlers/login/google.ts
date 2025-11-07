import Elysia from "elysia";
import {  loginWithGooglelModelType } from "../../types";
import { loginWithGoogleService } from "../../services/login";

export const withGoogle = new Elysia()
    .use(loginWithGooglelModelType)
    .post('/google', async ({ set, body }) => {
        try {
            const data = await loginWithGoogleService(body)
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
                msg: error instanceof Error ? error.message : "Login Failed",
            }
        }
    },
        {
            body: "auth.login.google.body",
            response: "auth.login.google.response"
        }
    );