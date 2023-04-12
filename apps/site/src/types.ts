import { boolean } from 'boolean';
import { z } from 'zod';

import { cleanupUrl } from '~/util';

export const FeedUrlSchema = z.object({
  url: z.string(),
  lookupStatus: z.enum(['in_progress', 'completed', 'error']),
  autoDiscovery: z.boolean().optional(),
  validated: z.boolean().optional(),
});

export type FeedUrl = z.infer<typeof FeedUrlSchema>;

const zodBooleanParse = z
  .union([
    z.boolean(),
    z.number().transform((val) => boolean(val)),
    z.string().transform((val) => boolean(val)),
  ])
  .optional();

export const FeedCheckParamsSchema = z.object({
  url: z.string().min(3).transform(cleanupUrl),
  scanForFeeds: zodBooleanParse,
  scanAll: zodBooleanParse,
});

export type FeedCheckParams = z.infer<typeof FeedCheckParamsSchema>;

export const URLParamsSchema = FeedCheckParamsSchema.partial().extend({
  url: z.string().optional(),
  lucky: zodBooleanParse,
});

export type URLParams = z.infer<typeof URLParamsSchema>;

export type LookupStatus = 'clear' | 'in_progress' | 'completed';
