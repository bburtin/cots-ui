import {
  AppBar,
  Toolbar,
  Typography
} from '@mui/material';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Check Out the Score!
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
