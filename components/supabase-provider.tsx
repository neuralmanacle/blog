"use client"

import * as React from "react"
import { supabase } from "@/lib/supabaseClient"
import {
  articles as fallbackArticles,
  mergeArticlesWithLocalFallbacks,
  type Article,
} from "@/lib/articles"
import { photos as fallbackPhotos, type Photo } from "@/lib/photography"
import { siteChanges as fallbackChanges, type SiteChange } from "@/lib/changes"
import { books as fallbackBooks, type Book } from "@/lib/books"

interface SupabaseDataContextType {
  articles: Article[]
  photos: Photo[]
  siteChanges: SiteChange[]
  books: Book[]
  loading: boolean
}

const SupabaseDataContext = React.createContext<SupabaseDataContextType>({
  articles: fallbackArticles,
  photos: fallbackPhotos,
  siteChanges: fallbackChanges,
  books: fallbackBooks,
  loading: true,
})

export function SupabaseDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<Omit<SupabaseDataContextType, 'loading'>>({
    articles: fallbackArticles,
    photos: fallbackPhotos,
    siteChanges: fallbackChanges,
    books: fallbackBooks,
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) {
      setLoading(false)
      return
    }

    async function loadData() {
      try {
        const [articlesRes, photosRes, changesRes, booksRes] = await Promise.all([
          supabase.from("articles").select("*"),
          supabase.from("photos").select("*"),
          supabase.from("site_changes").select("*"),
          supabase.from("books").select("*"),
        ])

        setData({
          articles: mergeArticlesWithLocalFallbacks(articlesRes.data),
          photos: photosRes.data && photosRes.data.length > 0 ? photosRes.data : fallbackPhotos,
          siteChanges: changesRes.data && changesRes.data.length > 0 ? changesRes.data : fallbackChanges,
          books: booksRes.data && booksRes.data.length > 0 ? booksRes.data : fallbackBooks,
        })
      } catch (e) {
        console.error("Failed to load Supabase data, falling back to local files.", e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <SupabaseDataContext.Provider value={{ ...data, loading }}>
      {children}
    </SupabaseDataContext.Provider>
  )
}

export function useSupabaseData() {
  return React.useContext(SupabaseDataContext)
}
