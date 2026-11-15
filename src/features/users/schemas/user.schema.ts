import { z } from 'zod';
import {
  emailSchema,
  fullNameSchema,
  passwordSchema,
  userNameSchema,
} from '@/features/auth/schemas/register.schema';
import { INTEREST } from '@/shared/constants/interests';
import { ROLE } from '@/shared/constants/roles';

/** Same rules as the API's UpdateUserDto: everything except the password. */
export const updateUserSchema = z.object({
  userName: userNameSchema,
  fullName: fullNameSchema,
  email: emailSchema,
  role: z.enum(Object.values(ROLE), { message: 'Pick a role' }),
  interests: z.array(z.enum(Object.values(INTEREST))),
});

/** Same rules as the API's CreateUserDto: an admin sets the first password. */
export const createUserSchema = updateUserSchema.extend({
  password: passwordSchema,
});

/** The edit form has no password field, so its empty value passes. It is never sent. */
export const editUserFormSchema = updateUserSchema.extend({
  password: z.string(),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;
export type CreateUserValues = z.infer<typeof createUserSchema>;
