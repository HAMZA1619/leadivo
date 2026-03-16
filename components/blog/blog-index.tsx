"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { BlogCard, BlogCardFeatured } from "@/components/blog/blog-card"
import { BLOG_CATEGORIES, type BlogPostMeta } from "@/lib/blog/types"
import { cn } from "@/lib/utils"

const POSTS_PER_PAGE = 12

function FadeIn({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.35s ease ${delay}ms, transform 0.35s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export function BlogIndex({ posts }: { posts: BlogPostMeta[] }) {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  const featured = useMemo(() => posts.filter((p) => p.featured), [posts])

  const filtered = useMemo(() => {
    let result = posts
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.keywords.some((k) => k.toLowerCase().includes(q))
      )
    }
    return result
  }, [posts, activeCategory, query])

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE)
  const paginated = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)

  const showFeatured = !activeCategory && !query.trim() && page === 1

  function handleCategoryChange(cat: string | null) {
    setActiveCategory(cat)
    setPage(1)
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(1)
  }

  return (
    <div>
      {/* Header */}
      <FadeIn>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">{t("blog.title")}</h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            {t("blog.subtitle")}
          </p>
        </div>
      </FadeIn>

      {/* Featured */}
      {showFeatured && featured.length > 0 && (
        <FadeIn delay={60}>
          <div className="mb-10">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {featured.slice(0, 2).map((post) => (
                <BlogCardFeatured key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Search */}
      <FadeIn delay={100}>
        <div className="relative mb-4">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder={t("blog.searchPlaceholder")}
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full rounded-xl border bg-background py-2.5 ps-10 pe-4 text-sm outline-none ring-ring transition-shadow focus:ring-2"
          />
        </div>
      </FadeIn>

      {/* Categories */}
      <FadeIn delay={120}>
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
              !activeCategory
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "hover:border-primary/50 hover:bg-muted"
            )}
          >
            {t("blog.all")}
          </button>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                activeCategory === cat.slug
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "hover:border-primary/50 hover:bg-muted"
              )}
            >
              {t(`blog.categories.${cat.slug}`, cat.label)}
            </button>
          ))}
        </div>
      </FadeIn>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">{t("blog.noArticles")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 40}>
                <BlogCard post={post} />
              </FadeIn>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:border-primary/50 hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all",
                    p === page
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border hover:border-primary/50 hover:bg-muted"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-all hover:border-primary/50 hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
