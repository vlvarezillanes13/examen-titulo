import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormHelperText,
  Grid,
  TextField,
  List,
  ListItem,
  Typography,
  IconButton,
  TypographyProps
} from '@mui/material'
import { Edit } from '@mui/icons-material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { validarToken } from '../helpers'
import { instanceMiddleware, instanceMiddlewareApi } from 'src/axios'
import Swal from 'sweetalert2'
import { useAuth } from 'src/hooks/useAuth'
import { IPersona } from '../interfaces'
import Close from 'mdi-material-ui/Close'
import { useDropzone } from 'react-dropzone'
import { styled } from '@mui/material/styles'


type Props = {
  personaProps: IPersona
  setPersona: Dispatch<SetStateAction<IPersona | null>>
}

export const CardEditarPersona = ({ personaProps, setPersona}: Props) => {
  const schemaYup = yup.object({
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

  interface FileProp {
    name: string
    type: string
    size: number
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm<IFormInputs>({
    resolver: yupResolver(schemaYup)
  })

  const [cargando, setCargando] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])
  const auth = useAuth()

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <img width={38} height={38} src='/icons/file-icons/pdf.png' />
    }
  }

  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => setFiles([])}>
        <Close />
      </IconButton>
    </ListItem>
  ))

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'archive/*': ['.pdf']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const Img = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
      marginRight: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('sm')]: {
      width: 250
    }
  }))

  const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    marginBottom: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(4)
    }
  }))


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
      const updateUser = {
        ...dataForm,
        Id: personaProps.id
      }

      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
      const { data } = await instanceMiddleware.put('/Persona/ActualizarPersona', updateUser, {
        headers: {
          Authorization: `Bearer ${tkn || auth.token}`
        }
      })
      if (data) {
        Swal.fire({
          title: 'Cambio exitoso',
          icon: 'success',
          text: `De: ${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
          confirmButtonText: 'OK'
        })
        reset()
        setPersona(null)
      } else {
        Swal.fire({
          title: 'Error al actualizar persona',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    } catch (error: any) {
      console.log('Error', error)
      Swal.fire({
        title: 'Error al actualizar persona',
        icon: 'error',
        text: error.message,
        confirmButtonText: 'OK'
      })
    } finally {
      setCargando(false)
    }
  }

  const cargarInformacion = (persona: IPersona) => {
    setCargando(true)

    setValue('Rut', persona?.rut || '')
    setValue('Dv', persona?.dv || '')
    setValue('Nombres', persona?.nombres || '')
    setValue('ApellidoPaterno', persona?.apellidoPaterno || '')
    setValue('ApellidoMaterno', persona?.apellidoMaterno || '')
    setValue('Edad', persona?.edad || 0)
    setValue('Correo', persona?.correo || '')

    setCargando(false)
  }

  useEffect(() => {
    cargarInformacion(personaProps)
  }, [])

  return (
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
                  <Box
                    {...getRootProps({ className: 'dropzone' })}
                    sx={
                      files.length
                        ? {
                            height: 120,
                            width: '100%',
                            border: '5px dashed #DBDBDD',
                            padding: '4px',
                            display: 'flex',
                            justifyContent: 'center'
                          }
                        : { border: '5px dashed #DBDBDD', padding: '4px' }
                    }
                  >
                    <input {...getInputProps()} />
                    {files.length ? (
                      <Box>
                        <List>{fileList}</List>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: ['column', 'column', 'row'],
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Img width={200} alt='Upload img' src='/images/misc/upload.png' />
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}
                        >
                          <HeadingTypography variant='h6'>Ingresa Curriculum en PDF</HeadingTypography>
                          <Typography color='textSecondary'>Arrastra el archivo aquí o haz un click </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', height: '100%' }}>
                    <Button variant='outlined' color='warning' size='large' sx={{ height: '100%' }} type='submit'>
                      <Edit sx={{ mr: 1 }} />
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
