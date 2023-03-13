import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  TextField
} from '@mui/material'
import { PersonSearch } from '@mui/icons-material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { validarToken } from '../helpers'
import { instanceMiddleware, instanceMiddlewareApi } from 'src/axios'
import Swal from 'sweetalert2'
import { useAuth } from 'src/hooks/useAuth'
import { IPersona } from '../interfaces'
import { CardEditarPersona } from './CardEditarPersona'

export const CardBuscarPersona = () => {
  const schemaYup = yup.object({
    Rut: yup.string().required('RUT es requerido'),
    Dv: yup.string().required('Dígito Verficador es requerido')
  })

  interface IFormInputs {
    Rut: string
    Dv: string
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaYup)
  })

  const [cargando, setCargando] = useState<boolean>(false)
  const [persona, setPersona] = useState<IPersona | null>(null)
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
      const { data } = await instanceMiddleware.get(`/Persona/ObtenerPersona/${dataForm.Rut}/${dataForm.Dv}`, {
        headers: {
          Authorization: `Bearer ${tkn || auth.token}`
        }
      })
      if (data) {
        Swal.fire({
          title: 'Persona encontrada',
          icon: 'success',
          text: `De: ${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
          confirmButtonText: 'OK'
        })
        setPersona(data)
      } else {
        Swal.fire({
          title: 'Persona no encontrada',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        setPersona(null)
      }
    } catch (error: any) {
      console.log('Error', error)
      Swal.fire({
        title: 'Error al obtener persona',
        icon: 'error',
        text: error.message,
        confirmButtonText: 'OK'
      })
      setPersona(null)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (!persona) reset()
  }, [persona, reset])

  return (
    <>
      <Card sx={{ mb: 5 }}>
        <CardHeader title='Formulario de Edición' />
        <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <Grid container spacing={5}>
              {cargando ? (
                <Grid item xs={12}>
                  <Box textAlign='center'>
                    <CircularProgress />
                  </Box>
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
                          onChange={onChange}
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
                      render={({ field: { value, onChange } }) => (
                        <TextField
                          fullWidth
                          label='Dígito Verificador de la persona'
                          onChange={onChange}
                          value={value}
                          error={Boolean(errors.Dv)}
                          placeholder='Ingrese Dígito Verificador'
                          inputProps={{ maxLength: 1 }}
                        />
                      )}
                    />
                    {errors.Dv && <FormHelperText sx={{ color: 'error.main' }}>{errors.Dv.message}</FormHelperText>}
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', height: '100%' }}>
                      <Button variant='outlined' color='warning' size='large' sx={{ height: '100%' }} type='submit'>
                        <PersonSearch sx={{ mr: 1 }} />
                        Buscar
                      </Button>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
      {persona ? (
        <>
          <Divider />
          <CardEditarPersona personaProps={persona} setPersona={setPersona} />
        </>
      ) : null}
    </>
  )
}
