import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR") + "원"
}

/** DB의 images JSON 배열 또는 레거시 image_url 중 대표 이미지 URL */
export function productPrimaryImage(product: {
  image_url?: string | null
  images?: unknown
}): string | null {
  const fromArray =
    Array.isArray(product.images) && product.images.length > 0
      ? String(product.images[0])
      : ""
  const url = (product.image_url || fromArray).trim()
  return url || null
}
