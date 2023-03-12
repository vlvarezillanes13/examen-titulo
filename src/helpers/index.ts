import jwt from 'jsonwebtoken'


export const validarToken = (tkn: string) => {
  const decode: jwt.Jwt | null  = jwt.decode(tkn, { complete: true })
  if (decode) {
    try{
        const exp = JSON.parse( JSON.stringify(decode.payload) ).exp
        const date = new Date(exp * 1000 - 30000)
        if (date > new Date()) return true
    
        return false
    }catch{
        return false
    }
  }

  return false
}
