/**
 * Nạp nội dung nháp từ thư mục content/ (markdown + front-matter) vào bảng
 * content_items trên Supabase. Chạy: npm run seed
 *
 * Yêu cầu .env.local có NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

// Nạp .env.local thủ công (script chạy ngoài Next.js runtime nên không tự
// đọc .env.local như next dev).
function loadEnvLocal() {
  try {
    const envPath = join(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    console.warn("Không đọc được .env.local — dùng biến môi trường hệ thống nếu có.");
  }
}

loadEnvLocal();

const CONTENT_DIR = join(process.cwd(), "content");

type ContentFrontMatter = {
  slug: string;
  title: string;
  content_type: "template" | "source_list" | "self_check" | "checklist";
  required_tier: "free" | "mvp2" | "mvp3" | "mvp4";
  sort_order: number;
};

function collectMarkdownFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectMarkdownFiles(full));
    else if (entry.name.endsWith(".md")) files.push(full);
  }
  return files;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local");
    process.exit(1);
  }

  const db = createClient(url, key, { auth: { persistSession: false } });
  const files = collectMarkdownFiles(CONTENT_DIR).filter((f) => !f.endsWith("quiz-draft.md"));

  let count = 0;
  for (const file of files) {
    const raw = readFileSync(file, "utf-8");
    const { data, content } = matter(raw);
    const fm = data as ContentFrontMatter;

    if (!fm.slug || !fm.title || !fm.content_type || !fm.required_tier) {
      console.warn(`Bỏ qua ${file} — thiếu front-matter bắt buộc`);
      continue;
    }

    const { error } = await db.from("content_items").upsert(
      {
        slug: fm.slug,
        title: fm.title,
        body: content.trim(),
        content_type: fm.content_type,
        required_tier: fm.required_tier,
        sort_order: fm.sort_order ?? 0,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`Lỗi khi seed ${fm.slug}:`, error.message);
    } else {
      count++;
      console.log(`✓ ${fm.slug}`);
    }
  }

  console.log(`\nĐã seed ${count}/${files.length} content item(s).`);
}

main();
