"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  qty: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: { id: string; name: string; price: number; image_url?: string }, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  totalCount: () => number
  totalPrice: () => number
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const items = get().items
        const existing = items.find((i) => i.productId === product.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product.id ? { ...i, qty: i.qty + qty } : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image_url || "",
                qty,
              },
            ],
          })
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) })
        } else {
          set({
            items: get().items.map((i) =>
              i.productId === productId ? { ...i, qty } : i
            ),
          })
        }
      },

      clearCart: () => set({ items: [] }),

      totalCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: "wagashi-cart" }
  )
)

export default useCartStore
