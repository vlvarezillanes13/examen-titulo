"use client";

import { Box, Grid, Typography, OutlinedInput, InputAdornment, IconButton, Button } from "@mui/material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
// ** Icons Imports
import {EyeOutline, EyeOffOutline} from 'mdi-material-ui'


const schema = yup.object().shape({
  Username: yup.string().required("Ingrese un username valido"),
  Password: yup.string().required("Ingrese su contraseña"),
});

interface IInputForm {
  Username: string;
  Password: string;
}

export default function Login() {
  const [errorMsg, setErrorMsg] = useState<boolean>(true);
  const [verPass, setVerPass] = useState<boolean>(false);

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IInputForm>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: IInputForm) => {
    console.log(data);
  };

  return (
    <Box sx={{ height: "100%", width: "100%", pt: 5, m: 0 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={8}>
          <img
            style={{
              height: "calc( 100vh - 40px)",
              width: "100%",
              display: "block",
            }}
            src="images/login/img_login.jpg"
            alt="Logo de inicio"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              spacing={5}
              gap={5}
              sx={{
                display: "flex",
                flexDireccion: "column",
                pt: 5,
                pr:5,
                textAlign: "center",
              }}
            >
              <Grid item xs={12}>
                <Box sx={{ height: "100%", width: "100%" }}>
                  <Typography variant="h2">Gestor de Personas</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h4">Ingreso a la Plataforma</Typography>
                </Box>
              </Grid>
              {errorMsg ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" color='red'>Crendeciales Invalidas</Typography>
                  </Box>
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <Controller
                  name="Username"
                  control={control}
                  defaultValue={""}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      fullWidth
                      label="Nombre de Usuario"
                      onChange={onChange}
                      value={value}
                      error={Boolean(errors.Username)}
                      placeholder="Nombre de Usuario"
                      autoComplete='false'
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="Password"
                  control={control}
                  defaultValue={""}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      fullWidth
                      label="Contraseña"
                      onChange={onChange}
                      value={value}
                      error={Boolean(errors.Username)}
                      placeholder="Contraseña"
                      autoComplete='false'
                      type={ verPass ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setVerPass(!verPass)}
                          >
                            {verPass ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" sx={{ width:'100%', height:'56px'}}>
                  Ingresar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}
