import { z } from 'zod';

const DelegatesSchema = z.object({
  groupName: z.string(),
  groupUrl: z.string(),
  delegates: z.array(z.string()),
});

export type Delegates = z.infer<typeof DelegatesSchema>;
