// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

const FooterContent = () => {

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, realizado con el `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` por `}
        <Link target='_blank' href='https://github.com/vlvarezillanes13/examen-titulo'>
          Vicente Álvarez
        </Link>
      </Typography>
    </Box>
  )
}

export default FooterContent
