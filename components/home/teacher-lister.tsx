"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ptBR } from '@mui/x-data-grid/locales';
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Essay {
  id: string;
  title: string;
  status: string;
  student: Student;
}

// Enum for Essay status translation
const statusTranslations: { [key: string]: string } = {
  CREATED: "Criado",
  WAITING_REVIEW: "Aguardando Revisão",
  REVIEWED: "Revisado",
  FINISHED: "Concluído",
};

export default function TeacherReviewLister() {
  const { data: session } = useSession();
  const router = useRouter();
  const [essays, setEssays] = useState<Essay[]>([]); // Annotate the state with the Essay type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      redirect("/auth");
    }
  }, [session]);

  useEffect(() => {
    // @ts-ignore
    if (session?.user?.id) {
    // @ts-ignore
      fetchTeacherEssays(session.user.id);
    }
  }, [session]);

  const fetchTeacherEssays = async (teacherId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/teacher_essays?teacherId=${teacherId}`);
      const data = await response.json();

      if (response.ok) {
        setEssays(data.data);
      } else {
        setError("Failed to fetch essays.");
      }
    } catch (err) {
      console.error("Error fetching teacher essays:", err);
      setError("An error occurred while fetching essays.");
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef<Essay>[] = [
    {
      field: "title",
      headerName: "Título",
      flex: 2,
    },
    {
      field: "student",
      headerName: "Aluno",
      flex: 1,
      valueGetter: (params) => {
        // @ts-ignore
        return params.name;
      }
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      valueGetter: (params) => {
        // Translate the status value
        return statusTranslations[params as keyof typeof statusTranslations] || params;
      }
    },
    {
      field: "see",
      headerName: "Ver",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(`/essays/${params.row.id}`)}
        >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        padding: 4,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h4">Trabalhos a Revisar</Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress />
          <Typography sx={{ marginLeft: 2 }}>Carregando trabalhos...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <DataGrid
          rows={essays}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
            height: 400,
          }}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        />
      )}
    </Box>
  );
}
