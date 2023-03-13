import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Grid } from '@mui/material'
import { DataGrid, esES, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import { instanceMiddleware } from 'src/axios'
import { DeleteEmpty } from 'mdi-material-ui'
import { IPersona } from 'src/interfaces'
import Swal from 'sweetalert2'
import { useAuth } from '../hooks/useAuth'
import { validarToken } from '../helpers/index'
import { instanceMiddlewareApi } from '../axios/index'

import FileSaver from 'file-saver'

import * as XLSX from 'xlsx'

import { useRouter } from 'next/router'

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
  const router = useRouter()

  const obtenerPersonas = async () => {
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
      const { data } = await instanceMiddleware.get('/Persona/ObtenerPersonas', {
        headers: {
          Authorization: `Bearer ${tkn || auth.token}`
        }
      })
      if (data) {
        setListPersonas(data)
      } else {
        Swal.fire({
          title: 'Error al obtener listado de personas',
          icon: 'error',
          text: data,
          confirmButtonText: 'OK'
        })
      }
    } catch (error: any) {
      console.log('Error', error)
      Swal.fire({
        title: 'Error obtener listado de personas',
        icon: 'error',
        text: error.message,
        confirmButtonText: 'OK'
      })
    } finally {
      setCargando(false)
    }
  }

  const deleteHoraMedica = async (id: string) => {
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
          let tkn = auth.token
          if (!validarToken(auth.token || '')) {
            const { data: dataTKN, status: statusTKN } = await instanceMiddlewareApi.post('/token', auth.user)
            if (statusTKN == 200) {
              auth.setToken(dataTKN)
              tkn = dataTKN
            }
          }
          process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
          const { data } = await instanceMiddleware.delete(`/Persona/EliminarPersona/${id}`, {
            headers: {
              Authorization: `Bearer ${tkn || auth.token}`
            }
          })

          if (data) {
            Swal.fire({
              title: 'Elminado exitoso',
              icon: 'success',
              text: `De: ${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
              confirmButtonText: 'OK'
            })
            obtenerPersonas()
          } else {
            Swal.fire({
              title: 'Error al eliminar registro',
              icon: 'error',
              confirmButtonText: 'OK'
            })
          }
        }
      })
    } catch (error: any) {
      console.log('Descripción error:', error)
      Swal.fire({
        title: 'Error al agregar personas',
        icon: 'error',
        text: error.response.data,
        confirmButtonText: 'OK'
      })
    }
  }

  const exportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const newData: any[] = listPersonas.map((x: IPersona) => {
      const newX = {
        Rut: x.rut,
        DV: x.dv,
        Nombres: x.nombres,
        ['Apellido Paterno']: x.apellidoPaterno,
        ['Apellido Materno']: x.apellidoMaterno,
        Edad: x.edad,
        Correo: x.correo
      }

      return newX
    })

    const ws = XLSX.utils.json_to_sheet(newData)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, 'Listado_Personas_'+`${new Date().toISOString().split('T')[0]}`+ fileExtension)
  }

  useEffect(() => {
    obtenerPersonas()
  }, [])

  return (
    <Card sx={{ mb: 5, position: 'relative' }}>
      <CardHeader title='Lista de Personas' />
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10
        }}
      >
        <Button color='success' onClick={ () => router.push('/gestor-personas/agregar/')}>Añadir una Persona</Button>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 250
        }}
      >
        <Button color='success' onClick={exportToExcel}>
          Exportar a Excel
        </Button>
      </Box>
      <CardContent sx={{ pt: theme => `${theme.spacing(2.5)} !important` }}>
        <Grid container spacing={5}>
          {!cargando ? (
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
          ) : (
            <Grid item xs={12}>
              <Box textAlign='center'>
                <CircularProgress />
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  )
}
