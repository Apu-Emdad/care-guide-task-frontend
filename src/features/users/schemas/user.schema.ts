import { z } from 'zod';
import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
  userNameSchema,
} from '@/features/auth/schemas/register.schema';
import { INTEREST } from '@/shared/constants/interests';
import { ROLE } from '@/shared/constants/roles';

export const updateUserSchema = z.object({
  userName: userNameSchema,
  fullName: fullNameSchema,
  email: emailSchema,
  role: z.enum(Object.values(ROLE), { message: 'Pick a role' }),
  interests: z.array(z.enum(Object.values(INTEREST))),
});

export const createUserSchema = updateUserSchema.extend({
  password: passwordSchema,
});

export const editUserFormSchema = updateUserSchema.extend({
  password: z.string(),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;
export type CreateUserValues = z.infer<typeof createUserSchema>;
