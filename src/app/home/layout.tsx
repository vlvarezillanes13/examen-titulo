"use client";
import { useEffect, useState } from "react";

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Box,
  ListItemButton,
  Divider,
} from "@mui/material";

import {
  BackupOutlined,
  BorderColorOutlined,
  FileDownloadOutlined,
  HomeOutlined,
  ListAltOutlined,
  PersonAddAlt1Outlined,
  WidgetsOutlined,
} from "@mui/icons-material";



import { ITEM_MENU } from "../constant";

const data = [
  {
    id: 1,
    name: "Inicio",
    icon: <HomeOutlined />,
  },
  { id: 2, name: "Listado de Colaboradores", icon: <ListAltOutlined /> },
  { id: 3, name: "Ingreso de Colaboradores", icon: <PersonAddAlt1Outlined /> },
  { id: 4, name: "Modificación Colaborador", icon: <BorderColorOutlined /> },
  { id: 5, name: "Ingreso de expedientes", icon: <BackupOutlined /> },
  { id: 6, name: "Exportación de Colaboradores", icon: <FileDownloadOutlined /> }
];

export default function Layout({ children }: { children: React.ReactNode }) {

    const[ itemMenu, setItemMenu ] = useState<number>(0)

    const handleClickItem = (i: number) => {
        setItemMenu( i )
        window.localStorage.setItem(ITEM_MENU, i.toString())
    }

    useEffect(() => {
      setItemMenu(parseInt(window.localStorage.getItem(ITEM_MENU) || '0'))
    }, [])
    
  const getList = () => (
    <div style={{ width: "auto" }}>
      <ListItem
        key={"title"}
        sx={{
          width: "100%",
          p: 2,
        }}
      >
        <ListItemText
          primary="Menú de Navegación"
          sx={{ textAlign: "center" }}
        />
        <ListItemIcon> <WidgetsOutlined /> </ListItemIcon>
      </ListItem>
      <Divider />
      {data.map((item: any, index: number) => (
        <ListItemButton key={item.id} sx={{ minHeight: 60 }} selected={( itemMenu == index ) ? true : false  } onClick={ () => handleClickItem(index) } >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItemButton>
      ))}
    </div>
  );

  
  return (
    <Grid container gap={1}>
      <Grid item xs={2}>
        <Box
          sx={{ height: "100vh", width: "100%", borderRight: "1px solid #DDD" }}
        >
          {getList()}
        </Box>
      </Grid>
      <Grid item xs={9}>
        <div style={{ marginLeft: 1 }}>{children}</div>
      </Grid>
    </Grid>
  );
}
