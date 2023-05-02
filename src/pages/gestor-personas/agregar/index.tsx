import Head from 'next/head'
import { CardAgregarPersona } from 'src/components'

const index = () => {
  return (
    <>
      <Head>
        <title>Agregar Persona</title>
      </Head>
      <CardAgregarPersona />
    </>
  )
}

index.acl = {
  action: 'read',
  subject: 'agregar'
}

export default index
