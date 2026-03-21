import type { SupabaseClient } from "@supabase/supabase-js"

export const PRODUCT_IMAGES_BUCKET = "product-images"

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export async function uploadProductImageFile(
  supabase: SupabaseClient,
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "JPG, PNG, WebP, GIF 이미지만 업로드할 수 있습니다." }
  }
  if (file.size > MAX_BYTES) {
    return { error: "파일 크기는 5MB 이하여야 합니다." }
  }
  const extFromName = file.name.split(".").pop()?.toLowerCase()
  const ext =
    extFromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(extFromName)
      ? extFromName === "jpeg"
        ? "jpg"
        : extFromName
      : file.type === "image/jpeg"
        ? "jpg"
        : (file.type.split("/")[1] ?? "jpg")
  const path = `products/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })
  if (error) return { error: error.message }
  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl }
}
