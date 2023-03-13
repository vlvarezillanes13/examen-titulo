// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { GridToolbarContainer } from '@mui/x-data-grid'
import { FileUpload, PersonAdd } from '@mui/icons-material'

import Close from 'mdi-material-ui/Close'
import Magnify from 'mdi-material-ui/Magnify'
import { Button } from '@mui/material'


interface Props {
  value: string
  clearSearch: () => void
  onChange: (e: ChangeEvent) => void
  exportToExcel : () => void
  agregar: () => void
}

const StyledGridToolbarContainer = styled(GridToolbarContainer)({
  m: '5',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between'
})

export const ToolBarBase = (props: Props) => {
  

  return (
    <StyledGridToolbarContainer>
      <Box sx={{ margin: '15px 10px' }}>
        <Button variant='outlined' color='success' onClick={props.agregar}>
        <PersonAdd sx={{ mr:2}} /> Añadir una Persona
        </Button>
      </Box>
      <Box sx={{ margin: '15px 0px' }}>
        <Button variant='outlined' color='primary' onClick={props.exportToExcel}>
          <FileUpload sx={{ mr:2}}/> Exportar a Excel
        </Button>
      </Box>
      <Box sx={{ margin: '15px 0px' }}>
        <TextField
          variant='standard'
          value={props.value}
          onChange={props.onChange}
          placeholder='Buscar'
          InputProps={{
            startAdornment: <Magnify fontSize='small' />,
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
                <Close fontSize='small' />
              </IconButton>
            )
          }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto'
            },
            m: theme => theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
              mr: 0.5
            },
            '& .MuiInput-underline:before': {
              borderBottom: 1,
              borderColor: 'divider'
            }
          }}
        />
      </Box>
    </StyledGridToolbarContainer>
  )
}
