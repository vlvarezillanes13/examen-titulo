// ** Icon imports
import { HomeOutline, FormatListBulleted, AccountPlus, AccountEdit } from 'mdi-material-ui'
import ShieldOutline from 'mdi-material-ui/ShieldOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Inicio',
      icon: HomeOutline,
      path: '/home'
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
    },
    {
      title: 'acl',
      icon: ShieldOutline,
      path: '/acl',
      action: 'read',
      subject: 'acl-page'
    }
  ]
}

export default navigation
