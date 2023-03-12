export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  usuario: string
  pass: string
}

export type RegisterParams = {
  email: string
  username: string
  password: string
}

export type UserDataType = {
  id: number
  nombrePerfil: string
  username: string
  perfil: number
}

export type AuthValuesType = {
  loading: boolean
  setLoading: (value: boolean) => void
  logout: () => void
  isInitialized: boolean
  user: UserDataType | null
  setUser: (value: UserDataType | null) => void
  setIsInitialized: (value: boolean) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  token: string | null
  setToken : (value: string | null) => void
}
