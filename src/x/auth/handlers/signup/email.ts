import Elysia from "elysia";
import { signupWithEmailModelType } from "../../types/signup";
import { signupWithEmailService } from "../../services/signup";


export const withEmail = new Elysia()
  .use(signupWithEmailModelType)
  .post('/email', async ( {set ,body} )=>{
    try {
      const data = await signupWithEmailService(body);
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
        msg: error instanceof Error ? error.message : "Signup Failed",
      }
    }
  },
  {
    body: 'auth.signup.email.body',
    response: 'auth.signup.email.response'
  });