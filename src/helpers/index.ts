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
  const secuencia = [2, 3, 4, 5, 6, 7, 2, 3]
  let sum = 0

  for (let i = digits.length - 1; i >= 0; i--) {
    const d = digits.charAt(i)
    sum += parseInt(d) * secuencia[digits.length - (i + 1)]
  }

  const rest = 11 - (sum % 11)

  return rest === 11 ? '0' : rest === 10 ? 'K' : `${rest}`
}

export const formatearRut = (rut: string) => {
  if (rut.length > 0) {
    return rut.replace(/\./g, '').replace('-', '')
  }

  return ''
}

export const validarRutRegexp = (rut: string) => {
  const regexp = /^\d{1,2}\d{3}\d{3}$/g

  return regexp.test(rut) ? true : false
}

export const escapeRegExp = (value: string): string => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}
