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

export default index;