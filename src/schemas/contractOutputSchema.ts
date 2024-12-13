import { z } from 'zod';

export const contractOutputResultSchema = z.object({
  tag: z.literal('result'),
  value: z.any(), // any for now but will change to the specific responses for each api call
});

export const contractErrorSchema = z.object({
  errorCode: z.string(),
  message: z.string(),
});

export const contractOutputErrorSchema = z.object({
  tag: z.literal('error'),
  value: contractErrorSchema,
});
