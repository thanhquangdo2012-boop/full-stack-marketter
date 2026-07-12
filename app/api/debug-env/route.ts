import { NextResponse } from "next/server";

// Endpoint tạm thời để chẩn đoán thiếu Environment Variables trên Vercel.
// Chỉ trả về true/false (đã set hay chưa), KHÔNG trả giá trị thật.
// XOÁ file này sau khi debug xong.
export async function GET() {
  const check = (v: string | undefined) => Boolean(v && v.length > 0);
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: check(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: check(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: check(process.env.SUPABASE_SERVICE_ROLE_KEY),
    UPSTASH_REDIS_REST_URL: check(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: check(process.env.UPSTASH_REDIS_REST_TOKEN),
    AUTH_SECRET: check(process.env.AUTH_SECRET),
    ADMIN_EMAIL: check(process.env.ADMIN_EMAIL),
    ADMIN_PASSWORD_HASH: check(process.env.ADMIN_PASSWORD_HASH),
    BANK_ACCOUNT_NAME: check(process.env.BANK_ACCOUNT_NAME),
    BANK_ACCOUNT_NUMBER: check(process.env.BANK_ACCOUNT_NUMBER),
    BANK_NAME: check(process.env.BANK_NAME),
    NEXT_PUBLIC_ZALO_CONTACT: check(process.env.NEXT_PUBLIC_ZALO_CONTACT),
  });
}
