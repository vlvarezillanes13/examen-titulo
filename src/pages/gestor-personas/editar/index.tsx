import Head from "next/head";
import { CardBuscarPersona } from "src/components";

const index = () => {
  return (
    <>
    <Head>
    <title>Editar de Persona</title>
    </Head>
    <CardBuscarPersona />
    </>
  )
}

index.acl = {
  action: 'read',
  subject: 'editar'
}

export default index;