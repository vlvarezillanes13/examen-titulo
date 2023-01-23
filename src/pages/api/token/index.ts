import type { NextApiRequest, NextApiResponse } from "next";
import { ICredencialesAcceso } from "../../../app/interfaces/ICredencialesAcceso.interface";
import { instanceAxiosApi } from "../../../app/helpers/axios/index";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const credenciales: ICredencialesAcceso = req.body;
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    const { data, status } = await instanceAxiosApi.post(
      "/Autenticacion/ObtenerToken",
      credenciales
    );
    return (data)
      ? res.status(200).json(data)
      : res.status(status).end("Error al ingresar");
  } catch (err: any) {
    return res.status(err.status || 500).end(err.message);
  }
};

export default index;