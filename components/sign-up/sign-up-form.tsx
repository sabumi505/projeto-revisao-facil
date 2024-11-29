"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, TextField, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  email: string;
  password: string;
  role: "student" | "teacher";
  name: string;
}

const roleMapping: Record<string, string> = {
  student: "Estudante",
  teacher: "Professor",
};

export default function SignUpForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      role: "student",
      name: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { email, password, role, name } = data;

    try {
      const response: any = await signIn("credentials", {
        email,
        password,
        role,
        mode,
        name,
        redirect: false,
      });

      if (response?.ok) {
        toast.success(`${mode === "signup" ? "Signup" : "Login"} Successful!`, {
          position: "top-right",
        });
        router.push("/");
        router.refresh();
      } else {
        const errorMessage = response.error || "An unknown error occurred.";
        toast.error(errorMessage, {
          position: "top-right",
        });
        console.log(`${mode === "signup" ? "Signup" : "Login"} Failed:`, errorMessage);
      }
    } catch (error: any) {
      console.log("Unexpected Error:", error);
      toast.error("Unexpected error occurred. Please try again later.", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
          m: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#2d2d2d",
          borderRadius: 2,
          border: "1.5px solid #cccccc",
        }}
      >
        <Typography variant="h6" color="white" textAlign="center">
          {mode === "signup" ? "Cadastrar" : "Entrar"}
        </Typography>

        {mode === "signup" && (
          <TextField
            label="Nome"
            variant="outlined"
            type="name"
            fullWidth
            {...register("name", {
              required: "Nome é obrigatório",
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputProps={{ style: { color: "white" } }}
            InputLabelProps={{ style: { color: "#cccccc" } }}
          />
        )}

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          {...register("email", {
            required: "Email é obrigatório",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Email inválido",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#cccccc" } }}
        />

        <TextField
          label="Senha"
          variant="outlined"
          type="password"
          fullWidth
          {...register("password", {
            required: "Senha é obrigatória",
            minLength: {
              value: 6,
              message: "Senha precisa ter pelo menos 6 caracteres",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{ style: { color: "white" } }}
          InputLabelProps={{ style: { color: "#cccccc" } }}
        />

        <FormControl fullWidth>
          <InputLabel id="role-label" sx={{ color: "#cccccc" }}>
            Função
          </InputLabel>
          <Select
            labelId="role-label"
            defaultValue="student"
            {...register("role", { required: "Role is required" })}
            sx={{ color: "white" }}
          >
            <MenuItem value="student">{roleMapping.student}</MenuItem>
            <MenuItem value="teacher">{roleMapping.teacher}</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{
            mt: 2,
            backgroundColor: "#1a73e8",
            "&:hover": { backgroundColor: "#1765c7" },
          }}
        >
          {isSubmitting ? (mode === "signup" ? "Signing Up..." : "Logging In...") : mode === "signup" ? "Cadastrar" : "Entrar"}
        </Button>

        <Button
          onClick={() => setMode((prevMode) => (prevMode === "signup" ? "login" : "signup"))}
          variant="text"
          sx={{
            color: "#1a73e8",
            mt: 1,
            "&:hover": {
              backgroundColor: "#f1f1f1", // Light background on hover
              color: "#1765c7", // Change text color on hover
              cursor: "pointer", // Cursor to indicate clickable
              transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition
            },
          }}
        >
          Trocar para {mode === "signup" ? "Login" : "Cadastrar"}
        </Button>

      </Box>
      <ToastContainer />
    </>
  );
}
