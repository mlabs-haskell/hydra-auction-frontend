import { z } from 'zod';

export const DelegateInfoSchema = z.object({
  delegateGroupServers: z.object({
    httpServers: z.array(z.string()),
    wsServers: z.array(z.string()),
  }),
  delegateGroupMetadata: z.string(),
});

export type DelegateInfo = z.infer<typeof DelegateInfoSchema>;
