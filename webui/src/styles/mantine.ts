import { createTheme, NavLink } from "@mantine/core";

export const theme = createTheme({
  fontFamily: '"Patrick Hand", sans-serif;',
  fontSizes: {
    xs: "14px",
    sm: "16px",
    md: "18px",
    lg: "20px",
    xl: "22px",
  },

  components: {
    NavLink: NavLink.extend({
      styles: (theme) => ({
        label: {
          fontSize: theme.fontSizes.md,
        },
      }),
    }),
  },
});
