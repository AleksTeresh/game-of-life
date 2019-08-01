export interface CellProps {
  alive: boolean
}

export type Generation = CellProps[][]

export interface User {
  id: number
  name: string
  email: string
}

export interface UserWithPassword extends Omit<User, 'id'> {
  hashedPassword: string
}