import { CardListadoPersonas } from "src/components";
import Head from 'next/head';

const index = () => {
  return (
    <>
    <Head>
    <title>Listado de Persona</title>
    </Head>
    <CardListadoPersonas />
    </>
  )
}

index.acl = {
  action: 'read',
  subject: 'listado'
}

export default index;