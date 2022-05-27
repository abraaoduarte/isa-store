import '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    neutral: {
      100: React.CSSProperties['color'];
      200: React.CSSProperties['color'];
      300: React.CSSProperties['color'];
      400: React.CSSProperties['color'];
      500: React.CSSProperties['color'];
      600: React.CSSProperties['color'];
      700: React.CSSProperties['color'];
      800: React.CSSProperties['color'];
      900: React.CSSProperties['color'];
    };
  }

  interface Palette {
    neutral: {
      100: React.CSSProperties['color'];
      200: React.CSSProperties['color'];
      300: React.CSSProperties['color'];
      400: React.CSSProperties['color'];
      500: React.CSSProperties['color'];
      600: React.CSSProperties['color'];
      700: React.CSSProperties['color'];
      800: React.CSSProperties['color'];
      900: React.CSSProperties['color'];
    };
  }
}
