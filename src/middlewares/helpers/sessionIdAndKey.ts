import crypto from 'node:crypto'

export const generateSessionId = ()=> {
    return crypto.randomBytes(24).toString("hex")
}

export const generateAuthSessionKey = (id?:string)=> {
    return id ?`sessionId:${id}:${generateSessionId()}`: `sessionId:${generateSessionId()}`
}