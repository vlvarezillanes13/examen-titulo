import { NextApiRequest, NextApiResponse } from 'next/types'
import { instanceMiddleware } from 'src/axios'

const getTokenApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = req.body
    delete user.nombrePerfil
    delete user.token
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

    const { data } = await instanceMiddleware.post(`/Autenticacion/ObtenerToken`, user)

    return res.status(200).json(data)
  } catch (error: any) {
    return res.status(error.data.status).json(error.erros)
  }
}

export default getTokenApi
