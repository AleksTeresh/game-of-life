export interface CellProps {
  alive: boolean
}

export type Generation = CellProps[][]

export interface User {
  id: number
  name: string
  email: string
}

export interface DbUser extends User {
  hashedPassword: string
}

export interface UserWithPassword extends Omit<User, 'id'> {
  hashedPassword: string
}

export interface AuthResponse {
  token: string
  user: User
}