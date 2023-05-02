// ** JWT import
import jwt from 'jsonwebtoken'

// ** Mock Adapter
import mock from 'src/@fake-db/mock'
import { instanceMiddlewareApi } from 'src/axios'


const jwtConfig = {
  secret: process.env.JWT_SECRET!,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET!
}

mock.onPost('/jwt/login').reply(async request => {
  const { usuario, pass } = JSON.parse(request.data)

  const dataRes = {
    username: usuario,
    password: pass
  }
  const error = {
    usuario: ['Usuario o Contraseña invalido']
  }
  

  try {
    const { data, status } = await instanceMiddlewareApi.post('/login', dataRes)
    const { data:dataTKN, status:statusTKN } = await instanceMiddlewareApi.post('/token', data)
    if (status == 200 && statusTKN== 200) {
      const dataUserLocalStorage = {
        id: data.id,
        nombrePerfil: data.nombrePerfil,
        username: data.username,
        password: data.password,
        perfil: data.perfil,
        token: dataTKN,
        idPersona: data.idPersona
      }
      const accessToken = jwt.sign(dataUserLocalStorage, jwtConfig.secret)

      const response = {
        accessToken
      }

      return [200, response]
    } else {

      return [status, { error }]
    }

  } catch {
    return [400, { error }]
  }
})


mock.onGet('/auth/me').reply(config => {
  // @ts-ignore
  const token = config.headers.Authorization as string

  // get the decoded payload and header
  const decoded = jwt.decode(token, { complete: true })

  if (decoded) {
    // @ts-ignore
    const userData: JwtPayload = decoded.payload
    delete userData.password
    delete userData.iat

    return [200, { userData }]
  } else {
    return [401, { error: { error: 'Usuario Invalido' } }]
  }
})
