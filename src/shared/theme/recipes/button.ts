import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "lg",
    color: "black",
    fontWeight: "medium",
    fontSize: "sm",
    lineHeight: "short",
  },
  variants: {
    size: {
      sm: {
        px: "4",
        py: "1",
        height: "8",
      },
      md: {
        px: "3",
        py: "2.5",
        height: "10",
      },
      lg: {
        px: "4",
        py: "3",
        height: "11",
        minWidth: "27",
      },
      xl: {
        px: "25px",
        py: "4",
        height: "3.25",
        minWidth: "52",
      },
    },
    variant: {
      primary: {
        bg: "primary.500",
        border: "1px solid",
        borderColor: "primary.500",
        color: "white",
        borderRadius: "lg",
        _hover: {
          bg: "primary.700",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          _disabled: {
            bg: "gray.200",
            color: "gray.400",
            border: "1px solid transparent",
          },
        },
      },
      outline: {
        bg: "white",
        border: "1px solid",
        borderColor: "primary.500",
        color: "primary.500",
        borderRadius: "lg",
        _hover: {
          bg: "primary.50",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          _disabled: {
            bg: "white",
            color: "gray.400",
            border: "1px solid gray.400",
          },
        },
      },
      danger: {
        bg: "white",
        border: "1px solid red.500",
        borderColor: "system.text.danger",
        color: "system.text.danger",
        borderRadius: "lg",
        _hover: {
          bg: "primary.50",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          _disabled: {
            bg: "white",
            color: "gray.400",
            border: "1px solid gray.400",
          },
        },
      },
      light: {
        bg: "primary.50",
        border: "1px solid",
        borderColor: "transparent",
        color: "primary.500",
        borderRadius: "lg",
        _hover: {
          bg: "primary.100",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          _disabled: {
            bg: "gray.50",
            color: "gray.400",
          },
        },
      },
      // TODO: I have used constant colors below. Since gray.10, primary.50 is not working.
      milk: {
        bg: "#FEFEFE",
        border: "1px solid #DFE3E8",
        color: "#1A202C",
        borderRadius: "lg",
        fontSize: "14px",
        fontWeight: "500",
        _hover: {
          bg: "#F7FAFC",
          boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.05)",
          _disabled: {
            bg: "gray.50",
            color: "gray.400",
          },
          _active: {
            bg: "gray.100",
          },
        },
      },
      subtle: {
        bg: "primary.50",
        borderColor: "transparent",
        color: "primary.500",
        borderRadius: "lg",
        _hover: {
          bg: "primary.100",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          _disabled: {
            bg: "gray.50",
            color: "gray.400",
          },
        },
      },
      graysubtle: {
        bgColor: "background.100",
        color: "gray.800",
        fontSize: "sm",
        fontWeight: "medium",
        lineHeight: 6,
        border: 0,
        px: 2.5,
        py: 3,
        display: "flex",
        gap: 3,
        alignItems: "center",
        _hover: {
          bg: "gray.200",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          _disabled: {
            bg: "gray.50",
            color: "gray.400",
          },
        },
      },
      // error: {
      //   bg: "transparent",
      //   border: "1px solid",
      //   borderColor: "#C53030",
      //   color: "#C53030",
      //   borderRadius: "lg",
      //   _hover: {
      //     bg: "primary.100",
      //     boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
      //     _disabled: {
      //       bg: "gray.50",
      //       color: "gray.400",
      //     },
      //   },
      // },
      ghost: {
        bg: "transparent",
        border: "0",
        color: "primary.500",
        borderRadius: "lg",
        _hover: {
          bg: "primary.50",
          boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
          _disabled: {
            bg: "gray.50",
            color: "gray.400",
          },
        },
      },
    },
  },
  // sizes: {
  //   sm: {
  //     px: "16px",
  //     py: "4px",
  //     height: "32px",
  //   },
  //   md: {
  //     px: "12px",
  //     py: "10px",
  //     height: "40px",
  //   },
  //   lg: {
  //     px: "16px",
  //     py: "12px",
  //     height: "44px",
  //     minWidth: "108px",
  //   },
  //   xl: {
  //     px: "25px",
  //     py: "16px",
  //     height: "52px",
  //     minWidth: "205px",
  //   },
  // },
  defaultVariants: {
    variant: "primary",
  },
});
