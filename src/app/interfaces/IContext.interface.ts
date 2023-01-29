import { IUsuarioContext } from "./IUsuario.interface";
import { Dispatch, SetStateAction } from "react";

export interface IInputForm {
  Username: string;
  Password: string;
}

export interface IAuthContext {
  user: IUsuarioContext | null;
  token: string | null;
  setUser: (value: IUsuarioContext | null) => void;
  setToken: (value: string | null) => void;
  login: (
    dataForm: IInputForm,
    setCargando: Dispatch<SetStateAction<boolean>>,
    setErrorMsg: Dispatch<SetStateAction<boolean>>
  ) => void;
}
