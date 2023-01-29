"use client";

import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import { useRouter } from "next/navigation";
import {
  IAuthContext,
  IInputForm,
  IUsuario,
  IUsuarioContext,
} from "../interfaces";
import { instanceAxiosPropia } from "../helpers/axios";
import { TOKEN_DATA, USER_DATA } from "../constant";

const defaultProvider: IAuthContext = {
  user: null,
  token: null,
  setUser: () => null,
  setToken: () => null,
  login: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<IUsuarioContext | null>(
    defaultProvider.user
  );
  const [token, setToken] = useState<string | null>(defaultProvider.token);

  const router = useRouter();

  const login = async (
    dataForm: IInputForm,
    setCargando: Dispatch<SetStateAction<boolean>>,
    setErrorMsg: Dispatch<SetStateAction<boolean>>
  ) => {
    setCargando(true);
    setErrorMsg(false);
    try {
      const { data: credenciales } = await instanceAxiosPropia.post(
        "/login",
        dataForm
      );
      router.push("/home");
      delete credenciales.password;
      const user: IUsuario = {
        ...credenciales,
      };
      const { data: token } = await instanceAxiosPropia.post(
        "/token",
        { toke: null, credenciales: user}
      );
      window.localStorage.setItem(USER_DATA, JSON.stringify(user));
      window.localStorage.setItem(TOKEN_DATA, token);
      setUser(user);
      setToken(token);
    } catch (err) {
      setErrorMsg(true);
    } finally {
      setCargando(false);
    }
  };

  const values: IAuthContext = {
    user,
    token,
    setUser,
    setToken,
    login,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
