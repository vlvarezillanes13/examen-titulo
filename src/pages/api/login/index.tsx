import { NextApiRequest, NextApiResponse } from 'next/types'
import { instanceMiddleware } from 'src/axios'

const handleLoginMiddle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = req.body
    if (user) {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
      const { data } = await instanceMiddleware.post('/Autenticacion/Acceso', user)
      if (data) return res.status(200).json(data)

      return res.status(201).end('Error al ingresar')
    } else {
      return res.status(500).end('Error al obtener token')
    }
  } catch (error: any) {
    return res.status(error.status || 500).end(error.message)
  }
}

export default handleLoginMiddle
