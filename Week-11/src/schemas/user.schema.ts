import { z } from "zod";

export const signupSchema = z.object({
	username: z.string().toLowerCase(),
	password: z.string().min(6).max(64),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
});

export const signinSchema = z.object({
	username: z.string().toLowerCase(),
	password: z.string().min(6).max(64),
});

export const updateProfileSchema = z.object({
	firstName: z.string().min(1).optional(),
	lastName: z.string().min(1).optional(),
	password: z.string().min(6).max(64).optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
