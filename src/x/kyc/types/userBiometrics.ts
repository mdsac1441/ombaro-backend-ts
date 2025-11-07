import { t, Elysia } from "elysia";


export const getBiometricsParams = t.Object({
    face: t.File({ type: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime'],
        maxSize: '50m', // 50MB limit
      }),
    
  });
  
  
  export const biometricsModelType = new Elysia().model({
    "biometrics.body": getBiometricsParams,
    "biometrics.response": t.Object({
      success: t.Boolean(),
      message: t.String(),
      url: t.Optional(t.String()),
    }),
  });
  

  export type faceParams = typeof getBiometricsParams.static;