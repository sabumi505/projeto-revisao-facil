"use client";

import { Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemText, Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    "name": "Revisões",
    "link": "/",
  },
  {
    "name": "Sair",
    "link": "/logout",
  },
];

export function AppCustomLayout() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const openDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ }}>
      <AppBar sx={{ m: 0, p: 0 }} position="sticky">
        <Toolbar>
          <IconButton
            onClick={openDrawer}
            size="large"
            edge="start"
            aria-label="menu"
            color="inherit"
            sx={{
              mr: 2
            }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">Revisao Facil</Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={open} onClose={closeDrawer}>
        <Box display="flex" justifyContent="right">
          <Button
            title="Fechar Menu"
            onClick={closeDrawer}>
            <CloseIcon />
          </Button>
        </Box>
        <List>
          {
            menuItems.map((menuItem, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => router.push(menuItem.link)}>
                  <ListItemText primary={menuItem.name}></ListItemText>
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>
      </Drawer>
    </Box>
  );
}
