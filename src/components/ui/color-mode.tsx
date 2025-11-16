"use client"

import * as React from "react";
import { IconButton, useTheme, ThemeProvider, createTheme, type PaletteMode } from "@mui/material";
import { LuMoon, LuSun } from "react-icons/lu";

export interface ColorModeProviderProps {
  children: React.ReactNode;
}

export function ColorModeProvider({ children }: ColorModeProviderProps) {
  const [mode, setMode] = React.useState<PaletteMode>("light");

  const toggleColorMode = React.useCallback(() => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  }, []);

  // Create a MUI theme based on the mode
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      {React.cloneElement(children as React.ReactElement<any>, { mode, toggleColorMode })}
    </ThemeProvider>
  );
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

export function useColorMode(): UseColorModeReturn {
  const theme = useTheme();
  const [colorMode, setColorMode] = React.useState<ColorMode>(
    theme.palette.mode === "dark" ? "dark" : "light"
  );

  const toggleColorMode = React.useCallback(() => {
    setColorMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return {
    colorMode,
    setColorMode,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

interface ColorModeButtonProps extends Omit<React.ComponentProps<typeof IconButton>, "aria-label"> {}

export const ColorModeButton = React.forwardRef<HTMLButtonElement, ColorModeButtonProps>(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
      <IconButton
        onClick={toggleColorMode}
        aria-label="Toggle color mode"
        size="medium"
        ref={ref}
        {...props}
        sx={{
          "& svg": {
            width: 24,
            height: 24,
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    );
  }
);

interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(function LightMode(props, ref) {
  return <span {...props} ref={ref} className="mui-theme-light" />;
});

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(function DarkMode(props, ref) {
  return <span {...props} ref={ref} className="mui-theme-dark" />;
});
