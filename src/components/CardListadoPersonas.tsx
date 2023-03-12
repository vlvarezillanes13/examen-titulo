import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid } from '@mui/material'
import { DataGrid, esES, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { instanceMiddleware } from 'src/axios'
import { DeleteEmpty } from 'mdi-material-ui'
import { IPersona } from 'src/interfaces'
import Swal from 'sweetalert2'
import { useAuth } from '../hooks/useAuth'
import { validarToken } from '../helpers/index'
import { instanceMiddlewareApi } from '../axios/index';

export const CardListadoPersonas = () => {
  const columnsGrid: GridColDef[] = [
    {
      field: 'rut',
      headerName: 'Rut',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'dv',
      headerName: 'DV',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 100
    },
    {
      field: 'nombres',
      headerName: 'Nombre',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'apellidoPaterno',
      headerName: 'Apellido Paterno',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 150
    },
    {
      field: 'apellidoMaterno',
      headerName: 'Apellido Materno',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'edad',
      headerName: 'Edad',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'correo',
      headerName: 'Correo',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'Acciones',
      headerName: 'Acciones',
      headerAlign: 'center',
      align: 'center',
      flex: 0.5,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box>
            <Button sx={{ mt: 2, mb: 2, ml: 2 }} variant='text' color='error' onClick={() => deleteHoraMedica(row.id)}>
              <DeleteEmpty />
            </Button>
          </Box>
        )
      }
    }
  ]

  const [listPersonas, setListPersonas] = useState<IPersona[]>([])
  const [cargando, setCargando] = useState<boolean>(false)
  const [row, setRow] = useState<number>(10)
  const auth = useAuth()

  const obtenerPersonas = async () => {
    setCargando(true)
    try {
      console.log(auth.token)
      if (!validarToken(auth.token || '')){
        const { data:dataTKN, status:statusTKN } = await instanceMiddlewareApi.post('/token', auth.user)
        if(statusTKN == 200) auth.setToken(dataTKN)
      }
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
      const { data } = await instanceMiddleware.get('/Persona/ObtenerPersonas', {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      if (data) {
        setListPersonas(data)
      } else {
        Swal.fire({
          title: 'Error al obtener listado de personas',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    } catch (error) {
      console.log('Error', error)
    } finally {
      setCargando(false)
    }
  }

  const deleteHoraMedica = async (idHoraMed: string) => {
    try {
      Swal.fire({
        title: '¿ELIMINAR EL REGISTRO?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        confirmButtonColor: 'red',
        cancelButtonText: 'Cancelar'
      }).then(async (result: any) => {
        if (result.isConfirmed) {
          const { data: DataEliminar } = await instanceMiddleware.delete(
            `/GestionSalud/EliminaReservaHora/${idHoraMed}`
          )

          if (DataEliminar) {
            Swal.fire('Eliminado', ``, 'success')
          }

          obtenerPersonas()
        }
      })
    } catch (error: any) {
      console.log('Descripción error:', error)
    }
  }

  useEffect(() => {
    obtenerPersonas()
  }, [])

  return (
    <Card sx={{ mb: 5, position: 'relative' }}>
      <CardHeader title={`Horas Médicas`} />
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10
        }}
      >
        <Button color='success'>Añadir una Persona</Button>
      </Box>
      <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
        {!cargando ? (
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <DataGrid
                sx={{ height: '500px' }}
                rows={listPersonas}
                columns={columnsGrid}
                pageSize={row}
                onPageSizeChange={newPageSize => setRow(newPageSize)}
                rowsPerPageOptions={[5, 10, 20]}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                pagination
                getRowId={row => row.id}
              />
            </Grid>
          </Grid>
        ) : (
          <CircularProgress />
        )}
      </CardContent>
    </Card>
  )
}
