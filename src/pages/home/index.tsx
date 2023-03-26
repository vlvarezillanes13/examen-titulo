// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Head from 'next/head'
import { useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { GetServerSideProps, InferGetStaticPropsType } from 'next/types'
import { instanceMiddleware } from 'src/axios'
import { IPersona } from 'src/interfaces'


type Props = {
  data: InferGetStaticPropsType<IPersona[]>
}

const Home = ({ data }: Props) => {

  const ability = useContext(AbilityContext)
  

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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title='Bienvenido Trabajador!'></CardHeader>
              <CardContent>
                <Typography sx={{ mb: 2 }}>
                  Actualmente no tienes nuevas funciones!
                </Typography>
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
