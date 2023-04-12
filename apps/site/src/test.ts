import { boolean } from 'boolean';
import { z } from 'zod';
import { cleanupUrl } from '~/util';

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

export const URLParamsSchema = FeedCheckParamsSchema.partial().extend({
  lucky: zodBooleanParse,
});

console.log(URLParamsSchema.parse({ url: 'https://example.com', scanForFeeds: 'true' }));
