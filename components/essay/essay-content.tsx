// "use client";

// import {
//   Box,
//   CircularProgress,
//   Typography,
//   Divider,
//   Button,
//   Snackbar,
//   Alert,
//   TextField,
//   List,
//   ListItem,
//   MenuItem,
//   Select,
//   FormControl,
//   InputLabel
// } from "@mui/material";
// import { highlight, languages } from "prismjs";
// import { useState, useEffect } from "react";
// import Editor from "react-simple-code-editor";
// import "prismjs/themes/prism.css";
// import "prismjs/components/prism-markdown";

// enum EssayStatus {
//   CREATED = "CREATED",
//   WAITING_REVIEW = "WAITING_REVIEW",
//   REVIEWED = "REVIEWED",
//   FINISHED = "FINISHED",
// }

// const statusLabels: { [key in EssayStatus]: string } = {
//   [EssayStatus.CREATED]: "Created",
//   [EssayStatus.WAITING_REVIEW]: "Waiting Review",
//   [EssayStatus.REVIEWED]: "Reviewed",
//   [EssayStatus.FINISHED]: "Finished",
// };

// export function EssayContent({ essayId }: { essayId: string }) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [essay, setEssay] = useState<{
//     title: string;
//     content: string;
//     status: EssayStatus;
//     teacherId?: string;
//   } | null>(null);
//   const [content, setContent] = useState<string>("");
//   const [saving, setSaving] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const [teacherEmail, setTeacherEmail] = useState("");
//   const [teacherSearchResults, setTeacherSearchResults] = useState<
//     { id: string; name: string; email: string }[]
//   >([]);
//   const [selectedTeacher, setSelectedTeacher] = useState<{
//     id: string;
//     name: string;
//   } | null>(null);

//   const [selectedStatus, setSelectedStatus] = useState<EssayStatus | "">("");

//   useEffect(() => {
//     const fetchEssay = async () => {
//       try {
//         const response = await fetch(`/api/essays/${essayId}`);
//         const data = await response.json();
//         if (response.ok) {
//           setEssay(data);
//           setContent(data.content);
//           setSelectedStatus(data.status);

//           if (data.teacherId) {
//             const teacherResponse = await fetch(`/api/teachers/${data.teacherId}`);
//             const teacherData = await teacherResponse.json();
//             if (teacherResponse.ok) {
//               setSelectedTeacher({ id: data.teacherId, name: teacherData.name });
//             } else {
//               console.error("Failed to fetch teacher details.");
//             }
//           }
//         } else {
//           setError(data.message || "Failed to fetch essay.");
//         }
//       } catch (err) {
//         setError("Error fetching essay.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEssay();
//   }, [essayId]);

//   const handleSave = async () => {
//     if (!content.trim()) {
//       setError("Content cannot be empty.");
//       return;
//     }

//     setSaving(true);
//     try {
//       const response = await fetch(`/api/essays/${essayId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...essay,
//           content,
//           status: selectedStatus, // Send the updated status
//           teacherId: selectedTeacher?.id || null,
//         }),
//       });

//       if (response.ok) {
//         const updatedEssay = await response.json();
//         setEssay(updatedEssay);
//         setError(null);
//         setSuccess(true);
//       } else {
//         const data = await response.json();
//         setError(data.message || "Failed to save the essay.");
//       }
//     } catch (err) {
//       console.error("Error saving essay", err);
//       setError("Error saving essay.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSuccess(false);
//   };

//   const handleTeacherSearch = async (email: string) => {
//     setTeacherEmail(email);
//     if (!email.trim()) {
//       setTeacherSearchResults([]);
//       return;
//     }

//     try {
//       const response = await fetch(`/api/search_teachers?email=${encodeURIComponent(email)}`);
//       if (response.ok) {
//         const results = await response.json();
//         setTeacherSearchResults(results.data);
//       } else {
//         setTeacherSearchResults([]);
//       }
//     } catch (err) {
//       console.error("Error searching for teachers", err);
//       setTeacherSearchResults([]);
//     }
//   };

//   const handleTeacherSelect = (teacher: { id: string; name: string }) => {
//     setSelectedTeacher(teacher);
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           minHeight: "100vh",
//           color: "red",
//         }}
//       >
//         <Typography variant="h6">{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         maxWidth: "800px",
//         margin: "0 auto",
//         padding: 4,
//         backgroundColor: "#f5f5f5",
//         borderRadius: 2,
//         boxShadow: 2,
//       }}
//     >
//       <Typography variant="h4" gutterBottom>
//         {essay?.title}
//       </Typography>
//       <Divider sx={{ marginBottom: 2 }} />

//       <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//         Conteúdo:
//       </Typography>

//       <Box sx={{ marginTop: 3, display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
//         <Typography variant="subtitle1" color="text.secondary">
//           Status:
//         </Typography>
//         <FormControl fullWidth>
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value as EssayStatus)}
//           >
//             {Object.entries(statusLabels).map(([key, label]) => (
//               <MenuItem key={key} value={key}>
//                 {label}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       <Box
//         sx={{
//           display: "flex",
//           border: "1px solid #e0e0e0",
//           borderRadius: 1,
//           minHeight: 300,
//           backgroundColor: "#f9f9f9",
//           fontFamily: "monospace",
//           fontSize: 14,
//         }}
//       >
//         <Box
//           sx={{
//             padding: 2,
//             borderRight: "1px solid #e0e0e0",
//             backgroundColor: "#f3f3f3",
//             color: "#888",
//             textAlign: "right",
//             userSelect: "none",
//           }}
//         >
//           {content.split("\n").map((_, index) => (
//             <div key={index}>{index + 1}</div>
//           ))}
//         </Box>
//         <Editor
//           value={content}
//           onValueChange={setContent}
//           highlight={(code) => highlight(code, languages.markdown, "markdown")}
//           padding={10}
//           style={{
//             fontFamily: '"Fira code", "Fira Mono", monospace',
//             fontSize: 14,
//             minHeight: 300,
//             whiteSpace: "pre-wrap",
//             flex: 1,
//           }}
//         />
//       </Box>

//       <Box sx={{ marginTop: 3 }}>
//         <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//           Professor Avaliando:
//         </Typography>
//         {selectedTeacher ? (
//           <Typography variant="body1" color="primary">
//             {selectedTeacher.name} foi definido como o professor.
//           </Typography>
//         ) : (
//           <>
//             <TextField
//               fullWidth
//               label="Digite o email do professor"
//               value={teacherEmail}
//               onChange={(e) => handleTeacherSearch(e.target.value)}
//               variant="outlined"
//               margin="normal"
//             />
//             <List>
//               {(teacherSearchResults ?? []).map((teacher) => (
//                 <ListItem key={teacher.id} disablePadding>
//                   <Button
//                     onClick={() => handleTeacherSelect(teacher)}
//                     sx={{
//                       width: "100%",
//                       marginBottom: 1,
//                       textAlign: "left",
//                     }}
//                   >
//                     {teacher.name} ({teacher.email})
//                   </Button>
//                 </ListItem>
//               ))}
//             </List>
//           </>
//         )}
//       </Box>

//       <Box sx={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
//         {error && (
//           <Typography color="error" variant="body2" sx={{ marginRight: 2 }}>
//             {error}
//           </Typography>
//         )}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSave}
//           disabled={saving}
//         >
//           {saving ? "Salvando..." : "Salvar"}
//         </Button>
//       </Box>

//       <Snackbar
//         open={success}
//         autoHideDuration={3000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert severity="success" sx={{ width: "100%" }}>
//           Dados salvos com sucesso!
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

"use client";

import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  Button,
  Snackbar,
  Alert,
  TextField,
  List,
  ListItem,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { highlight, languages } from "prismjs";
import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-markdown";

enum EssayStatus {
  CREATED = "CREATED",
  WAITING_REVIEW = "WAITING_REVIEW",
  REVIEWED = "REVIEWED",
  FINISHED = "FINISHED",
}

const statusLabels: { [key in EssayStatus]: string } = {
  [EssayStatus.CREATED]: "Criado",
  [EssayStatus.WAITING_REVIEW]: "Aguardando Revisão",
  [EssayStatus.REVIEWED]: "Revisado",
  [EssayStatus.FINISHED]: "Concluído",
};

export function EssayContent({ essayId, isTeacher }: { essayId: string; isTeacher: boolean }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [essay, setEssay] = useState<{
    title: string;
    content: string;
    status: EssayStatus;
    teacherId?: string;
    adjustmentPoints?: string;
  } | null>(null);
  const [content, setContent] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [adjustmentPoints, setAdjustmentPoints] = useState<string>("");

  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherSearchResults, setTeacherSearchResults] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [selectedTeacher, setSelectedTeacher] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<EssayStatus | "">("");

  useEffect(() => {
    const fetchEssay = async () => {
      try {
        const response = await fetch(`/api/essays/${essayId}`);
        const data = await response.json();
        if (response.ok) {
          setEssay(data);
          setContent(data.content);
          setAdjustmentPoints(data.adjustmentPoints || "");
          setSelectedStatus(data.status);

          if (data.teacherId) {
            const teacherResponse = await fetch(`/api/teachers/${data.teacherId}`);
            const teacherData = await teacherResponse.json();
            if (teacherResponse.ok) {
              setSelectedTeacher({ id: data.teacherId, name: teacherData.name });
            } else {
              console.error("Failed to fetch teacher details.");
            }
          }
        } else {
          setError(data.message || "Failed to fetch essay.");
        }
      } catch (err) {
        setError("Error fetching essay.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEssay();
  }, [essayId]);

  const handleSave = async () => {
    if (!content.trim()) {
      setError("Content cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/essays/${essayId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...essay,
          content,
          adjustmentPoints,
          status: selectedStatus,
          teacherId: selectedTeacher?.id || null,
        }),
      });

      if (response.ok) {
        const updatedEssay = await response.json();
        setEssay(updatedEssay);
        setError(null);
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save the essay.");
      }
    } catch (err) {
      console.error("Error saving essay", err);
      setError("Error saving essay.");
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  const handleTeacherSearch = async (email: string) => {
    setTeacherEmail(email);
    if (!email.trim()) {
      setTeacherSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search_teachers?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const results = await response.json();
        setTeacherSearchResults(results.data);
      } else {
        setTeacherSearchResults([]);
      }
    } catch (err) {
      console.error("Error searching for teachers", err);
      setTeacherSearchResults([]);
    }
  };

  const handleTeacherSelect = (teacher: { id: string; name: string }) => {
    setSelectedTeacher(teacher);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "red",
        }}
      >
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: 4,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {essay?.title}
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />


      <Box sx={{ marginTop: 3, display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Status:
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as EssayStatus)}
          >
            {Object.entries(statusLabels).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Conteúdo:
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
          {content.split("\n").map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </Box>
        <Editor
          value={content}
          onValueChange={setContent}
          highlight={(code) => highlight(code, languages.markdown, "markdown")}
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

      {
        !isTeacher &&
      <Box sx={{ marginTop: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Professor Avaliando:
        </Typography>
        {selectedTeacher ? (
          <Typography variant="body1" color="primary">
            {selectedTeacher.name} foi definido como o professor.
          </Typography>
        ) : (
          <>
            <TextField
              fullWidth
              label="Digite o email do professor"
              value={teacherEmail}
              onChange={(e) => handleTeacherSearch(e.target.value)}
              variant="outlined"
              margin="normal"
            />
            <List>
              {(teacherSearchResults ?? []).map((teacher) => (
                <ListItem key={teacher.id} disablePadding>
                  <Button
                    onClick={() => handleTeacherSelect(teacher)}
                    sx={{
                      width: "100%",
                      marginBottom: 1,
                      textAlign: "left",
                    }}
                  >
                    {teacher.name} ({teacher.email})
                  </Button>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
      }

      <Box sx={{ marginTop: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Pontos de Ajuste:
        </Typography>
        {isTeacher ? (
          <TextField
            fullWidth
            multiline
            minRows={4}
            value={adjustmentPoints}
            onChange={(e) => setAdjustmentPoints(e.target.value)}
            placeholder="Insira os pontos de ajuste aqui"
            variant="outlined"
          />
        ) : (
          <Box
            sx={{
              padding: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              backgroundColor: "#f9f9f9",
              minHeight: 100,
            }}
          >
            <Typography variant="body1">{adjustmentPoints || "Nenhum ponto de ajuste definido."}</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
        {error && (
          <Typography color="error" variant="body2" sx={{ marginRight: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Dados salvos com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}

