import { z } from 'zod';

const DelegateGroupSchema = z.object({
  groupName: z.string(),
  groupUrl: z.string(),
  delegates: z.array(z.string()),
});

export type DelegateGroup = z.infer<typeof DelegateGroupSchema>;
