// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react';
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { GetServerSideProps, InferGetStaticPropsType } from 'next/types'
import { instanceMiddleware } from 'src/axios'
import { IPersona } from 'src/interfaces'
import { useAuth } from '../../hooks/useAuth';
import Box from '@mui/material/Box';


type Props = {
  data: InferGetStaticPropsType<IPersona[]>
}

const Home = ({ data }: Props) => {

  const ability = useContext(AbilityContext)
  
  const auth = useAuth()
  const [personas, setPersonas] = useState<IPersona[]>([])
  const [persona, setPersona] = useState<IPersona | null>(null)

  const buscarPersona = (persons: IPersona[]) => {
    console.log(personas)
    const person = persons.find( (x) => x.id == auth.user?.idPersona ) || null
    console.log(auth.user)
    setPersona(person)
  }

  useEffect(() => {
    setPersonas(data)
    if(auth.user?.idPersona != 0){
      buscarPersona(data)
    }
  }, [data])
  

  return (
    <>
      <Head>
        <title>Inicio</title>
      </Head>
      {ability?.can('read', 'admin') ? (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Bienvenido Administrador!'></CardHeader>
              <CardContent>
                <Typography sx={{ mb: 2 }}>
                  Puede utilizar navegador a su izquierda!
                </Typography>
                <Typography sx={{ mb: 2 }}>
                  Cantidad de personas registradas : { personas.length }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`Bienvenido!`}></CardHeader>
              <CardContent>
                <Typography sx={{ mb: 2 }}  variant="h5">
                  Su información actual es:
                </Typography>

                <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 'bold' }} variant="h6">
                  Nombres:
                </Typography>
                <Typography sx={{ fontSize: 20}} > 
                  { persona?.nombres }
                </Typography>
                </Box>
                
                <Box sx={{ mb: 2, fontWeight: 'bold' }}>
                <Typography  sx={{ fontWeight: 'bold' }} variant="h6">
                  Apellido Paterno:
                </Typography>
                <Typography sx={{ fontSize: 20}}>
                  { persona?.apellidoPaterno}
                </Typography>
                </Box>

                <Box sx={{ mb: 2, fontWeight: 'bold' }}>
                <Typography  sx={{ fontWeight: 'bold' }} variant="h6">
                  Apellido Materno:
                </Typography>
                <Typography sx={{ fontSize: 20}}>
                  { persona?.apellidoMaterno}
                </Typography>
                </Box>

                <Box sx={{ mb: 2, fontWeight: 'bold' }}>
                <Typography  sx={{ fontWeight: 'bold' }} variant="h6">
                  Edad:
                </Typography>
                <Typography sx={{ fontSize: 20}}>
                  { persona?.edad}
                </Typography>
                </Box>

                <Box sx={{ mb: 2, fontWeight: 'bold' }}>
                <Typography  sx={{ fontWeight: 'bold' }} variant="h6">
                  Correo:
                </Typography>
                <Typography sx={{ fontSize: 20}}>
                 { persona?.correo}
                </Typography>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )
}

Home.acl = {
  action: 'read',
  subject: 'home-page'
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {

  const user = {
    id: 1,
    username: "Admin",
    perfil: 1
  }

  try {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
    const { data: dataTKN} = await instanceMiddleware.post('/Autenticacion/ObtenerToken', user)
    const { data } = await instanceMiddleware.get('/Persona/ObtenerPersonas', {
      headers: {
        Authorization: `Bearer ${dataTKN}`
      }
    })

    if (data) {
      return {
        props: {
          data
        }
      }
    } else {
      return {
        props: {
          data: []
        }
      }
    }
  } catch (error) {
    console.log(error)

    return {
      props: {
        data: []
      }
    }
  }
}
