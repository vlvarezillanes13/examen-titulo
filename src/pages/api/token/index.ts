import type { NextApiRequest, NextApiResponse } from "next";
import { instanceAxiosApi } from "../../../app/helpers/axios/index";
import { validarToken } from "@/app/helpers";
import { IUsuarioContext } from "@/app/interfaces";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body.token && validarToken(req.body.token)) {
    console.log("mismo")
    res.status(200).json(req.body.token)
  } else {
    try {
      const credenciales: IUsuarioContext = req.body.credenciales;
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
      const { data, status } = await instanceAxiosApi.post(
        "/Autenticacion/ObtenerToken",
        credenciales
      );
    console.log("nuevo")
      return data
        ? res.status(200).json(data)
        : res.status(status).end("Error al ingresar");
    } catch (err: any) {
      return res.status(err.status || 500).end(err.message);
    }
  }
};

export default index;
