export function ThemeProvider({ children }) {
  return children;
}

export const useTheme = () => ({
  theme: 'light',
  toggleTheme: () => {},
});


