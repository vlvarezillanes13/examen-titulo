import jwt from 'jsonwebtoken'

export const validarToken = (tkn: string) => {
  const decode: jwt.Jwt | null = jwt.decode(tkn, { complete: true })
  if (decode) {
    try {
      const exp = JSON.parse(JSON.stringify(decode.payload)).exp
      const date = new Date(exp * 1000 - 10000)
      if (date > new Date()) return true

      return false
    } catch {
      return false
    }
  }

  return false
}

export const calcularDigitoVerificador = (digits: string): string => {
  let sum = 0
  let mul = 2

  let i = digits.length
  while (i--) {
    sum = sum + parseInt(digits.charAt(i)) * mul
    if (mul % 7 === 0) {
      mul = 2
    } else {
      mul++
    }
  }

  const res = sum % 11

  if (res === 0) {
    return '0'
  } else if (res === 1) {
    return 'k'
  }

  return `${11 - res}`
}
