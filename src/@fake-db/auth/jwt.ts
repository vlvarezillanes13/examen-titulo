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
        token: dataTKN
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

// mock.onPost('/jwt/register').reply(request => {
//   if (request.data.length > 0) {
//     const { email, password, username } = JSON.parse(request.data)
//     const isEmailAlreadyInUse = users.find(user => user.email === email)
//     const isUsernameAlreadyInUse = users.find(user => user.username === username)
//     const error = {
//       email: isEmailAlreadyInUse ? 'This email is already in use.' : null,
//       username: isUsernameAlreadyInUse ? 'This username is already in use.' : null
//     }

//     if (!error.username && !error.email) {
//       const { length } = users
//       let lastIndex = 0
//       if (length) {
//         lastIndex = users[length - 1].id
//       }
//       const userData = {
//         id: lastIndex + 1,
//         email,
//         password,
//         username,
//         avatar: null,
//         fullName: '',
//         role: 'admin'
//       }

//       //users.push(userData)

//       const accessToken = jwt.sign({ id: userData.id }, jwtConfig.secret)

//       const user = { ...userData }
//       delete user.password

//       const response = { accessToken }

//       return [200, response]
//     }

//     return [200, { error }]
//   } else {
//     return [401, { error: 'Invalid Data' }]
//   }
// })

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
