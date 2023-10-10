'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

type DarkThemeProviderProps = {
  children: React.ReactNode;
};

function DarkThemeProvider({ children }: DarkThemeProviderProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default DarkThemeProvider;
