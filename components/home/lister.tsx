"use client";

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material"; // Import loader component
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { highlight, languages } from "prismjs";
import { useState, useEffect } from "react";
import { ptBR } from '@mui/x-data-grid/locales';
import Editor from "react-simple-code-editor";
import "prismjs/components/prism-markdown";

// Translate the statuses
const statusTranslation: Record<string, string> = {
  CREATED: "Criado",
  WAITING_REVIEW: "Aguardando Revisão",
  REVIEWED: "Revisado",
  FINISHED: "Concluído",
};

export default function ReviewLister() {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [essay, setEssay] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [essays, setEssays] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (!session) {
      redirect("/auth");
    }
  }, [session]);

  useEffect(() => {
    // @ts-ignore
    if (session?.user?.id) {
      // @ts-ignore
      fetchEssays(session.user.id);
    }
  }, [session]);

  const fetchEssays = async (studentId: string) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(`/api/essays?studentId=${studentId}`);
      const data = await response.json();

      if (response.ok) {
        setEssays(data.data);
      } else {
        console.error("Failed to fetch essays");
      }
    } catch (error) {
      console.error("Error fetching essays", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Título",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      valueGetter: (params) => {
        // Translate the status using the translation map
        return statusTranslation[params] || params;
      },
    },
    {
      field: "teacher",
      headerName: "Professor",
      flex: 1,
      valueGetter: (params) => {
        // @ts-ignore
        return params?.name || 'Não atribuído';
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

  const handleAddRevision = () => {
    setOpen(true);
  };

  const handleSave = async () => {
    if (!title || !essay) {
      setError("Title and content are required.");
      return;
    }

    try {
      const response = await fetch("/api/essays", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content: essay,
          // @ts-ignore
          studentId: session?.user?.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOpen(false);
        // @ts-ignore
        fetchEssays(session?.user?.id);
      } else {
        setError("Failed to create essay.");
      }
    } catch (err) {
      console.error("Error creating essay", err);
      setError("Error creating essay.");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        <Typography variant="h4">Lista de Trabalhos</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRevision}
          sx={{
            backgroundColor: "#1a73e8",
            "&:hover": { backgroundColor: "#1765c7" },
          }}
        >
          Nova Revisão
        </Button>
      </Box>

      {/* Show loader or data grid */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress /> {/* Loader */}
          <Typography sx={{ marginLeft: 2 }}>Carregando trabalhos...</Typography>
        </Box>
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

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Nova Revisão</DialogTitle>
        <DialogContent>
          <TextField
            label="Título"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            Texto
          </Typography>
          <Box
            sx={{
              display: "flex",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              minHeight: 300,
              backgroundColor: "#f9f9f9",
              fontFamily: "monospace",
              fontSize: 14,
            }}
          >
            <Box
              sx={{
                padding: 2,
                borderRight: "1px solid #e0e0e0",
                backgroundColor: "#f3f3f3",
                color: "#888",
                textAlign: "right",
                userSelect: "none",
              }}
            >
              {essay.split("\n").map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </Box>
            <Editor
              value={essay}
              onValueChange={(code) => setEssay(code)}
              highlight={(code) =>
                highlight(code, languages.markdown, "markdown")
              }
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: 300,
                whiteSpace: "pre-wrap",
                flex: 1,
              }}
            />
          </Box>
          {error && (
            <Typography color="error" variant="body2" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
