import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({
      required_error: "El correo electrónico es requerido",
    })
    .email({
      message: "El correo electrónico no es válido",
    }),
  username: z
    .string({
      required_error: "El nombre de usuario es requerido",
    })
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    }),
  password: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .regex(/(?=.*\d)(?=.*[A-Z])(?=.*\W)/, {
      message:
        "La contraseña debe tener al menos un número, una letra mayúscula y un carácter especial",
    }),

  //   confirmPassword: z
  //     .string({
  //       required_error: "La confirmación de la contraseña es requerida",
  //     })
  //     .refine((data) => data.password === data.confirmPassword, {
  //       message: "Las contraseñas no coinciden",
  //       path: ["confirmPassword"],
  //     }),
});

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "El correo electrónico es requerido",
    })
    .email({
      message: "El correo electrónico no es válido",
    }),
  password: z.string({
    required_error: "La contraseña es requerida",
  }),
});

export const updateProfileSchema = z.object({
  username: z
    .string({
      required_error: "El nombre de usuario es requerido",
    })
    .min(3, {
      message: "El nombre de usuario debe tener al menos 3 caracteres",
    }),
  confirmPassword: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres",
    })
    .regex(/(?=.*\d)(?=.*[A-Z])(?=.*\W)/, {
      message:
        "La contraseña debe tener al menos un número, una letra mayúscula y un carácter especial",
    }),
  biography: z
    .string({
      required_error: "La biografía es requerida",
    })
    .max(255, {
      message: "La biografía no puede tener más de 255 caracteres",
    })
    .min(10, {
      message: "La biografía debe tener al menos 10 caracteres",
    }),
  phone: z.string({
    required_error: "El número de teléfono es requerido",
  }),
  newPassword: z
    .string({
      required_error: "La nueva contraseña es requerida",
    })
    .min(6, {
      message: "La nueva contraseña debe tener al menos 6 caracteres",
    })
    .regex(/(?=.*\d)(?=.*[A-Z])(?=.*\W)/, {
      message:
        "La nueva contraseña debe tener al menos un número, una letra mayúscula y un carácter especial",
    }),
  birthdate: z.date().optional(),
});
