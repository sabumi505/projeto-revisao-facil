"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, TextField, Typography, Box } from "@mui/material";

// Form validation schema using react-hook-form validation
interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    const { email, password } = data;

    try {
      const response: any = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!response?.error) {
        router.push("/");
        router.refresh();
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Show success toast
      alert({ title: "Login Successful" });
    } catch (error: any) {
      console.error("Login Failed:", error);
      // Show error toast
      alert({ title: "Login Failed", description: error.message });
    }
  };

  return (
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
        Login
      </Typography>

      <TextField
        label="Provide Email"
        variant="outlined"
        type="email"
        fullWidth
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: "Invalid email address",
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "#cccccc" } }}
      />

      <TextField
        label="Provide Password"
        variant="outlined"
        type="password"
        fullWidth
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{ style: { color: "white" } }}
        InputLabelProps={{ style: { color: "#cccccc" } }}
      />

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
        {isSubmitting ? "Opening..." : "Open Sesame!"}
      </Button>
    </Box>
  );
}
