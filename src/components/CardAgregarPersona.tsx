import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormHelperText,
  Grid,
  TextField
} from '@mui/material'
import { BookmarkAdd } from '@mui/icons-material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import { validarToken } from '../helpers'
import { instanceMiddleware, instanceMiddlewareApi } from 'src/axios'
import Swal from 'sweetalert2'
import { useAuth } from 'src/hooks/useAuth'
import { validarRutRegexp, calcularDigitoVerificador } from '../helpers/index';

export const CardAgregarPersona = () => {

  

  const schemaYupPersona = yup.object({
    Rut: yup.string().required('RUT es requerido').typeError('RUT es requerido'),
    Dv: yup.string().required('Dígito Verficador es requerido').typeError('Dígito Verficador es requerido'),
    Nombres: yup.string().required('Nombres es requerido').typeError('Nombres es requirido'),
    ApellidoMaterno: yup.string().required('Apellido Materno es requerido').typeError('Apellido Materno es requirido'),
    ApellidoPaterno: yup.string().required('Apellido Paterno es requerido').typeError('Apellido Paterno es requirido'),
    Edad: yup.number().required('Edad es requerida').typeError('Edad es requirido'),
    Correo: yup
      .string()
      .required('Correo es requerido')
      .email('Debes ingresar un email válido')
      .typeError('Correo es requerido')
  })

  interface IFormInputs {
    Rut: string
    Dv: string
    Nombres: string
    ApellidoPaterno: string
    ApellidoMaterno: string
    Edad: number
    Correo: string
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaYupPersona)
  })

  const [cargando, setCargando] = useState<boolean>(false)
  const [dv, setDv] = useState<string>('')
  const auth = useAuth()

  const handleSubmitForm = async (dataForm: IFormInputs) => {
    setCargando(true)
    try {
      let tkn = auth.token
      if (!validarToken(auth.token || '')) {
        const { data: dataTKN, status: statusTKN } = await instanceMiddlewareApi.post('/token', auth.user)
        if (statusTKN == 200) {
          auth.setToken(dataTKN)
          tkn = dataTKN
        }
      }
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
      const { data } = await instanceMiddleware.post('/Persona/AgregarPersona', dataForm, {
        headers: {
          Authorization: `Bearer ${tkn || auth.token}`
        }
      })
      if (data) {
        Swal.fire({
          title: 'Guardado exitoso',
          icon: 'success',
          text: `De: ${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
          confirmButtonText: 'OK'
        })
        reset()
      } else {
        Swal.fire({
          title: 'Error al agregar personas',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    } catch (error: any) {
      console.log('Error', error)
      Swal.fire({
        title: 'Error al agregar personas',
        icon: 'error',
        text: error.response.data,
        confirmButtonText: 'OK'
      })
    } finally {
      setCargando(false)
    }
  }

  const handleChangeDv = (newValue: any) => {
    if (validarRutRegexp(newValue.target.value)) {
      const newDv = calcularDigitoVerificador(newValue.target.value)
      setValue('Dv', newDv)
      setDv(newDv)
    } else {
      setDv('')
      setValue('Dv', '')
    }
  }

  return (
    <Card sx={{ mb: 5 }}>
      <CardHeader title='Formulario de Ingreso' />
      <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Grid container spacing={5}>
            {cargando ? (
              <Grid item xs={12}>
                {' '}
                <CircularProgress />{' '}
              </Grid>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='Rut'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='RUT de la persona'
                        onChange={(data) => {
                          onChange(data)
                          handleChangeDv(data)
                        }}
                        value={value}
                        error={Boolean(errors.Rut)}
                        placeholder='Ingrese RUT'
                        inputProps={{ maxLength: 8 }}
                      />
                    )}
                  />
                  {errors.Rut && <FormHelperText sx={{ color: 'error.main' }}>{errors.Rut.message}</FormHelperText>}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='Dv'
                    control={control}
                    render={({ field: {  onChange } }) => (
                      <TextField
                        fullWidth
                        label='Dígito Verificador de la persona'
                        onChange={onChange}
                        value={dv}
                        error={Boolean(errors.Dv)}
                        placeholder='Ingrese Dígito Verificador'
                        inputProps={{ readOnly: true }}
                      />
                    )}
                  />
                  {errors.Dv && <FormHelperText sx={{ color: 'error.main' }}>{errors.Dv.message}</FormHelperText>}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='Nombres'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Nombres de la persona'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.Nombres)}
                        placeholder='Ingrese Nombres'
                      />
                    )}
                  />
                  {errors.Nombres && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.Nombres.message}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='ApellidoPaterno'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Apellido Paterno de la persona'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.ApellidoPaterno)}
                        placeholder='Ingrese Apellido Paterno'
                      />
                    )}
                  />
                  {errors.ApellidoPaterno && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.ApellidoPaterno.message}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='ApellidoMaterno'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Apellido Materno de la persona'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.ApellidoMaterno)}
                        placeholder='Ingrese Apellido Materno'
                      />
                    )}
                  />
                  {errors.ApellidoMaterno && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.ApellidoMaterno.message}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='Edad'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Edad de la persona'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.Edad)}
                        placeholder='Ingrese edad'
                        type='number'
                      />
                    )}
                  />
                  {errors.Edad && <FormHelperText sx={{ color: 'error.main' }}>{errors.Edad.message}</FormHelperText>}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='Correo'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        fullWidth
                        label='Correo de la persona'
                        onChange={onChange}
                        value={value}
                        error={Boolean(errors.Correo)}
                        placeholder='Ingrese Correo'
                      />
                    )}
                  />
                  {errors.Correo && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.Correo.message}</FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', height: '100%' }}>
                    <Button variant='outlined' color='success' size='large' sx={{ height: '100%' }} type='submit'>
                      <BookmarkAdd sx={{ mr: 1 }} />
                      Grabar Cambios
                    </Button>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
