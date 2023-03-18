import Head from 'next/head'
import { CardAgregarPersona } from 'src/components'

const index = () => {
  return (
    <>
      <Head>
        <title>Agregar Persona</title>
        <CardAgregarPersona />
      </Head>
    </>
  )
}

export default index
