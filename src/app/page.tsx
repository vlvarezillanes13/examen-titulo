"use client";

import {
  Box,
  Grid,
  Typography,
  TextField,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
// ** Icons Imports
import { EyeOutline, EyeOffOutline } from "mdi-material-ui";
import { instanceAxiosPropia } from '../pages/axios/index';

const schema = yup.object().shape({
  Username: yup.string().required("Ingrese un username valido"),
  Password: yup.string().required("Ingrese su contraseña"),
});

interface IInputForm {
  Username: string;
  Password: string;
}

export default function Login() {
  const [errorMsg, setErrorMsg] = useState<boolean>(false);
  const [verPass, setVerPass] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IInputForm>({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (dataForm: IInputForm) => {
    setErrorMsg(false)
    const { data, status } = await  instanceAxiosPropia.post('/login', dataForm);
    if( status == 200){
      console.log(data)
    }else{
      setErrorMsg(true)
      console.log(data)
    }
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
                pr: 5,
              }}
            >
              <Grid item xs={12}>
                <Box sx={{ height: "100%", width: "100%", textAlign:'center' }}>
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
                    <Typography variant="h6" color="red">
                      Crendeciales Invalidas
                    </Typography>
                  </Box>
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <Controller
                  name="Username"
                  control={control}
                  defaultValue={""}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label="Nombre de Usuario"
                      onChange={onChange}
                      value={value}
                      error={Boolean(errors.Username)}
                      placeholder="Nombre de Usuario"
                      autoComplete="false"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="Password"
                  control={control}
                  defaultValue={""}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      fullWidth
                      onBlur={onBlur}
                      label="Contraseña"
                      onChange={onChange}
                      value={value}
                      error={Boolean(errors.Username)}
                      placeholder="Contraseña"
                      autoComplete="false"
                      type={verPass ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => setVerPass(!verPass)}
                            >
                              {verPass ? <EyeOutline /> : <EyeOffOutline />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ width: "100%", height: "56px" }}
                  type='submit'
                >
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
