import Elysia from "elysia";
import { loginWithEmailModelType } from "../../types/login/email";
import { loginWithEmailService } from "../../services/login";


export const withEmail = new Elysia()
  .use(loginWithEmailModelType)
  .post('/email', async ( {set ,body} )=>{
    try {
      const data = await loginWithEmailService(body);
      set.status = 200;
      return {
        success: true,
        code: 200,
        msg: data.message,
        data: {
            cookies:{
                ...data.cookies,
                accessToken: await data.cookies?.accessToken,
            }
        }
      }
    } catch (error) {
      return {
        success: false,
        code: 500,
        msg: error instanceof Error ? error.message : "login Failed",
      }
    }
  },
  {
    body: 'auth.login.email.body',
    response: 'auth.login.email.response'
  });