import jwt from "jsonwebtoken";

export const validarToken = (token: string) => {
  const { payload } = jwt.decode(token, { complete: true })!;
  try {
    const second = parseInt(payload.exp);
    if (payload && new Date(second * 1000) > new Date()) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};
