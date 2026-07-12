import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// RULE-09: rate limit trên serverless PHẢI dùng Redis (Upstash), không dùng
// biến in-memory — mỗi instance serverless không chia sẻ state với nhau.
//
// Khởi tạo LƯỜI (lazy) — không gọi Redis.fromEnv() ở module scope. Next.js
// "collect page data" lúc build sẽ evaluate module này để đọc route config,
// nên bất kỳ throw nào ở top-level (kể cả do thiếu env var tạm thời trong
// bước build) sẽ làm sập toàn bộ `next build`. Trì hoãn tới lần gọi .limit()
// đầu tiên (lúc chắc chắn đang chạy runtime, có đủ env) tránh lỗi này.
let redis: Redis | undefined;
function getRedis(): Redis {
  if (!redis) redis = Redis.fromEnv();
  return redis;
}

function lazyLimiter(prefix: string) {
  let limiter: Ratelimit | undefined;
  return {
    limit: (identifier: string) => {
      if (!limiter) {
        limiter = new Ratelimit({
          redis: getRedis(),
          limiter: Ratelimit.slidingWindow(5, "60 s"),
          prefix,
        });
      }
      return limiter.limit(identifier);
    },
  };
}

export const registerRateLimit = lazyLimiter("ratelimit:register");
export const loginRateLimit = lazyLimiter("ratelimit:login");
export const adminLoginRateLimit = lazyLimiter("ratelimit:admin-login");

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}
