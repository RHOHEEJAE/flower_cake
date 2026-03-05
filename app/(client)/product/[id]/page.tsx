import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import ProductDetailClient from "./product-detail-client"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (!product) notFound()

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", product.category_slug)
    .neq("id", id)
    .eq("is_active", true)
    .limit(4)

  return (
    <ProductDetailClient product={product} related={related || []} />
  )
}
