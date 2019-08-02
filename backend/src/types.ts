export interface CellProps {
  alive: boolean
}

export type Generation = CellProps[][]

export interface User {
  id: string
  name: string
  email: string
}

export interface DbUser extends User {
  password: string,
  curr_generation_index: number
}

export interface UserWithPassword extends Omit<User, 'id'> {
  hashedPassword: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface JwtPayload {
  userId: string
}