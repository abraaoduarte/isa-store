import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';
import type { FC } from 'react';
import CssBaseline from '@mui/material/CssBaseline';

const muiBaseTheme = createTheme({
  palette: {
    primary: {
      main: '#0F0E0E',
    },
    secondary: { main: '#541212' },
    info: { main: '#1272fc' },
    grey: {
      [50]: '#fafafa',
      [100]: '#f5f5f5',
      [200]: '#eeeeee',
      [300]: '#e0e0e0',
      [400]: '#bdbdbd',
      [500]: '#9e9e9e',
      [600]: '#757575',
      [700]: '#616161',
      [800]: '#424242',
      [900]: '#212121',
    },
  },
});

export const theme = createTheme({
  ...muiBaseTheme,
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          lineHeight: 1,
        },
      },
    },
  },
});

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
