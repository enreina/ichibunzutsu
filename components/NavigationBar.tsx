import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Typography from '@mui/material/Typography';

export type NavItemType = {
  key: string;
  text: string;
  href: string;
  as: string;
};

const NavigationLinks = ({ navItems }: { navItems: NavItemType[] }) => {
  return (
    <>
      {navItems.map((item) => (
        <Link key={item.key} href={item.href} as={item.as}>
          <Button sx={{ textTransform: 'none' }} variant="text">
            {item.text}
          </Button>
        </Link>
      ))}
    </>
  );
};

const NavigationList = ({
  navItems,
  onNavigationItemClick,
}: {
  navItems: NavItemType[];
  onNavigationItemClick: (navItem: NavItemType) => void;
}) => {
  return (
    <List>
      {navItems.map((item) => (
        <ListItem key={item.key} disablePadding>
          <ListItemButton
            onClick={() => onNavigationItemClick(item)}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

type NavItemClickHandlerType = (item: NavItemType) => void;

export const NavigationBar = ({
  navItems,
  navItemClickHandler,
}: {
  navItems: NavItemType[];
  navItemClickHandler: NavItemClickHandlerType;
}) => {
  const [isDrawerMenuOpen, setIsDrawerMenuOpen] = useState<boolean>(false);

  return (
    <>
      <AppBar color="transparent" elevation={0} component="nav">
        <Container sx={{ marginTop: 3 }} maxWidth="lg">
          <Toolbar disableGutters>
            {/* To ensure the center box is centered */}
            <Box
              sx={{
                flexGrow: 0,
                display: { xs: 'none', md: 'flex' },
                visibility: 'hidden',
              }}
            >
              <NavigationLinks navItems={navItems} />
            </Box>
            <Box
              sx={{
                flexGrow: 0,
                display: { xs: 'flex', md: 'none' },
                visibility: 'hidden',
              }}
            >
              <IconButton>
                <MenuIcon />
              </IconButton>
            </Box>

            {/* App Name in Middle */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                一文ずつ
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Ichi Bun Zutsu
              </Typography>
            </Box>

            {/* Menu Icon only on mobile view */}
            <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                aria-label="open menu bar"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => setIsDrawerMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            {/* Menu on dekstop view */}
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              <NavigationLinks navItems={navItems} />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="nav" onClick={() => setIsDrawerMenuOpen(false)}>
        <Drawer
          anchor="right"
          open={isDrawerMenuOpen}
          variant="temporary"
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          <Box>
            <NavigationList
              navItems={navItems}
              onNavigationItemClick={navItemClickHandler}
            />
          </Box>
        </Drawer>
      </Box>

      <Toolbar />
    </>
  );
};
