// ** Icon imports
import { HomeOutline, FormatListBulleted, AccountPlus, AccountEdit } from 'mdi-material-ui'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      path: '/home',
      action: 'read',
      subject: 'home-page',
      title: 'Inicio',
      icon: HomeOutline
    },
    {
      title: 'Listado de personas',
      icon: FormatListBulleted,
      path: '/gestor-personas/listado'
    },
    {
      title: 'Añadir una persona',
      icon: AccountPlus,
      path: '/gestor-personas/agregar'
    },
    {
      title: 'Editar una persona',
      icon: AccountEdit,
      path: '/gestor-personas/editar'
    }
  ]
}

export default navigation
