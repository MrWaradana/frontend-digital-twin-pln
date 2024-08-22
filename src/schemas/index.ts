import { z } from "zod";

const EMAIL_SCHEMA = z
    .string()
    .min(1, "Email Address is required.")
    .email("Invalid Email Address.");

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required."),
    password: z.string().min(1, "Password is required."),
});