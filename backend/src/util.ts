import * as jwt from 'jsonwebtoken'
import { JwtPayload } from './types'

export const SECRET = '42'

const isUserData = (jwtData: object | string): jwtData is JwtPayload => {
  return typeof jwtData === 'object' && 'userId' in jwtData
}

export const getUserId = (request) => {
  const Authorization = request.headers['authorization']
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const jwtData = jwt.verify(token, SECRET)

    if (isUserData(jwtData)) {
      return jwtData.userId
    } else {
      throw new Error('JWT payload is invalid')
    }
  }

  throw new Error('Not authenticated')
}
