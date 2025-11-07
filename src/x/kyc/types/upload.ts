import { t, Elysia } from "elysia";


export const getUploadParams = t.Object({
    documentImageFront: t.File({ type: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime'],
        maxSize: '50m', // 50MB limit
      }),
    documentImageBack: t.Optional(t.File({ type: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime'],
        maxSize: '50m', // 50MB limit
      })),
    documentType: t.String(), // e.g., "passport", "driver_license" 
  });
  
  
  export const uploadModelType = new Elysia().model({
    "upload.body": getUploadParams,
    "upload.response": t.Object({
      success: t.Boolean(),
      message: t.String(),
      url: t.Optional(t.String()),
    }),
  });
  

  export type contactParams = typeof getUploadParams.static;