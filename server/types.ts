/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
declare module 'nuxt'
declare module 'deta'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace Express {
    export interface Response {
       ok: (data: any) => void,
       fail: (error: any, statusCode?: number, message?: string) => void
    }
 }