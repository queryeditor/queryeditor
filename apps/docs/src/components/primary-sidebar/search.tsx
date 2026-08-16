import useDebounce from '@/hooks/use-debounce'
import { useState, useRef, useEffect, useMemo } from 'preact/hooks'
import { type SearchResult } from 'slugtree'
import {
  Document,
  NumberSymbol,
  Search as SearchIcon,
  Close as CloseIcon,
  CornerDownLeft
} from '@/components/icons'
import { cn } from '@queryeditor/shared'

const rawBase =
  import.meta.env.PUBLIC_DOCS_BASE || import.meta.env.BASE_URL || ''
const basePath = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase

interface FlattenedSearchItem {
  id: string
  title: string
  description?: string | null
  href: string
  isSubItem: boolean
  parentTitle?: string
}

function HighlightMatch({
  text,
  query
}: {
  text?: string | null
  query: string
}) {
  if (!text) return null
  const words = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

  if (words.length === 0) return <>{text}</>

  const regex = new RegExp(`(${words.join('|')})`, 'gi')
  const parts = text.split(regex)
  const matchSet = new Set(
    query
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase())
  )

  return (
    <>
      {parts.map((part, i) =>
        matchSet.has(part.toLowerCase()) ? (
          <span key={i} class="font-semibold text-accent">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  )
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const handleSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim()

    if (!trimmed) {
      setResults([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(
        `${basePath}/api/search?query=${encodeURIComponent(trimmed)}`
      )
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setResults(Array.isArray(data) ? data : [])
      setSelectedIndex(0)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const [debouncedValue, setDebouncedQuery] = useDebounce<string>({
    onDebounced: (val) => handleSearch(val || ''),
    delay: 200
  })

  const onInputChange = (val: string) => {
    setQuery(val)
    setDebouncedQuery(val)
  }

  const flatItems = useMemo<FlattenedSearchItem[]>(() => {
    const items: FlattenedSearchItem[] = []
    results.slice(0, 15).forEach((parent, pIdx) => {
      items.push({
        id: `search-item-${pIdx}`,
        title: parent.title,
        description: parent.description,
        href: parent.href,
        isSubItem: false
      })
      parent.children?.forEach((child, cIdx) => {
        items.push({
          id: `search-item-${pIdx}-${cIdx}`,
          title: child.title,
          description: child.content,
          href: child.href,
          isSubItem: true,
          parentTitle: parent.title
        })
      })
    })
    return items
  }, [results])

  const navigateTo = (href: string) => {
    setIsOpen(false)
    window.location.href = href
  }

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        return
      }

      if (e.key === '/' && !isOpen) {
        const target = e.target as HTMLElement
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault()
          setIsOpen(true)
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 40)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [flatItems])

  useEffect(() => {
    if (isOpen && flatItems.length > 0 && selectedIndex >= 0) {
      const activeEl = document.querySelector(
        `[data-search-index="${selectedIndex}"]`
      )
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex, isOpen, flatItems])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
      return
    }

    if (flatItems.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1 < flatItems.length ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : flatItems.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = flatItems[selectedIndex]
      if (selected) {
        navigateTo(selected.href)
      }
    }
  }

  return (
    <>
      <div class="px-3 pt-3 pb-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Search documentation (Press Ctrl+K or Cmd+K to open)"
          class="flex items-center justify-between w-full rounded-full border border-border/70 bg-foreground/2 hover:bg-foreground/5 hover:border-border/90 px-3 py-2  text-foreground/60 hover:text-foreground transition-all group shadow-2xs cursor-pointer"
        >
          <div class="flex items-center gap-2.5">
            <SearchIcon
              width={14}
              height={14}
              class="opacity-60 group-hover:opacity-100 group-hover:text-accent transition-all shrink-0"
            />
            <span class="font-normal text-foreground/50 group-hover:text-foreground/80 transition-colors">
              Search docs...
            </span>
          </div>
          <kbd class="pointer-events-none font-mono text-[10px] font-medium text-foreground/50 border border-border/60 bg-foreground/5 rounded-full px-1.5 py-0.5 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {isOpen && (
        <div
          class="fixed inset-0 z-100 flex items-start justify-center pt-12 sm:pt-20 p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Search documentation"
        >
          <div
            ref={dialogRef}
            class="w-full max-w-2xl bg-background border border-border/80 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
          >
            <div class="flex items-center px-4 border-b border-border/60 relative bg-foreground/1">
              <SearchIcon
                width={18}
                height={18}
                class="text-foreground/40 shrink-0 mr-3"
              />
              <input
                ref={inputRef}
                value={query}
                onInput={(e) => onInputChange(e.currentTarget.value)}
                placeholder="Search documentation, guides, and concepts..."
                class="w-full bg-transparent py-4 text-sm outline-none text-foreground placeholder:text-foreground/40 font-normal"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={flatItems.length > 0}
                aria-activedescendant={
                  flatItems[selectedIndex]?.id || undefined
                }
              />
              {query && (
                <button
                  type="button"
                  onClick={() => onInputChange('')}
                  class="p-1 text-foreground/40 hover:text-foreground rounded-full hover:bg-foreground/5 transition-colors mr-2 cursor-pointer"
                  aria-label="Clear search input"
                >
                  <CloseIcon width={16} height={16} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close search dialog"
              >
                <kbd class="border border-border/60 bg-foreground/5 px-1.5 py-0.5 rounded-full text-[10px]">
                  ESC
                </kbd>
              </button>
            </div>

            <div
              class="overflow-y-auto p-2 flex flex-col grow min-h-36 max-h-[50vh] divide-y divide-border/20"
              role="listbox"
              aria-label="Search results"
            >
              {loading && (
                <div class="py-12 flex flex-col items-center justify-center gap-2 text-foreground/50 ">
                  <div class="size-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching docs...</span>
                </div>
              )}

              {!loading && query && flatItems.length === 0 && (
                <div class="py-12 flex flex-col items-center justify-center gap-1 text-foreground/50 text-center px-4">
                  <p class="text-sm font-medium text-foreground/70">
                    No results found for &ldquo;{query}&rdquo;
                  </p>
                  <p class=" text-foreground/40">
                    Try searching for another keyword or topic.
                  </p>
                </div>
              )}

              {!loading && !query && (
                <div class="py-10 px-4 flex flex-col items-center justify-center text-center text-foreground/70">
                  <p class="">
                    Type a topic, component, or keyword to search across all
                    docs.
                  </p>
                  <div class="mt-4 flex flex-wrap justify-center gap-1.5 text-sm">
                    <span class="text-foreground/50">Quick jumps:</span>
                    {[
                      'Overview',
                      'Getting Started',
                      'MySQL',
                      'SQLite',
                      'AI Assistant'
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onInputChange(tag)}
                        class="px-2 py-0.5 rounded-md bg-foreground/4 hover:bg-foreground/8 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!loading && flatItems.length > 0 && (
                <div class="flex flex-col gap-1">
                  {flatItems.map((item, index) => {
                    const isSelected = selectedIndex === index
                    return (
                      <div
                        className={cn({
                          'ml-5 pl-2 border-l border-border/40': item.isSubItem
                        })}
                      >
                        <a
                          key={item.id}
                          id={item.id}
                          data-search-index={index}
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault()
                            navigateTo(item.href)
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          role="option"
                          aria-selected={isSelected}
                          className={cn(
                            'flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer group ',
                            isSelected
                              ? 'bg-accent/5 text-accent ring-1 ring-accent/30 shadow-2xs'
                              : 'text-foreground/80 hover:bg-foreground/4'
                          )}
                        >
                          <div class="flex items-start gap-3 min-w-0">
                            <div
                              class={`mt-0.5 shrink-0 ${
                                isSelected
                                  ? 'text-accent'
                                  : 'text-foreground/40 group-hover:text-foreground/70'
                              }`}
                            >
                              {item.isSubItem ? (
                                <NumberSymbol width={15} height={15} />
                              ) : (
                                <Document width={16} height={16} />
                              )}
                            </div>
                            <div class="min-w-0">
                              <div class="flex items-center gap-2">
                                {item.parentTitle && item.isSubItem && (
                                  <span class="text-xs text-foreground/40 truncate">
                                    <HighlightMatch
                                      text={item.parentTitle}
                                      query={query}
                                    />
                                    &rsaquo;
                                  </span>
                                )}
                                <span
                                  class={` truncate ${
                                    isSelected
                                      ? 'font-semibold text-accent'
                                      : 'font-medium text-foreground'
                                  }`}
                                >
                                  <HighlightMatch
                                    text={item.title}
                                    query={query}
                                  />
                                </span>
                              </div>
                              {item.description && (
                                <p
                                  class={`text-xs line-clamp-1 mt-0.5 ${
                                    isSelected
                                      ? 'text-accent/80'
                                      : 'text-foreground/50'
                                  }`}
                                >
                                  <HighlightMatch
                                    text={item.description}
                                    query={query}
                                  />
                                </p>
                              )}
                            </div>
                          </div>

                          {isSelected && (
                            <div class="shrink-0 flex items-center gap-1 text-accent ml-2">
                              <span class="text-xs uppercase font-mono tracking-wider font-semibold opacity-70">
                                Go
                              </span>
                              <CornerDownLeft width={13} height={13} />
                            </div>
                          )}
                        </a>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div class="px-4 py-2.5 bg-foreground/2 border-t border-border/50 flex items-center justify-between text-sm text-foreground/45">
              <div class="flex font-medium text-xs items-center gap-4">
                <span class="flex items-center gap-1">
                  <kbd class="bg-foreground/5 border border-border/60 px-1 rounded">
                    ↑
                  </kbd>
                  <kbd class="bg-foreground/5 border border-border/60 px-1 rounded">
                    ↓
                  </kbd>
                  <span>navigate</span>
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="bg-foreground/5 border border-border/60 px-1.5 rounded">
                    ↵
                  </kbd>
                  <span>select</span>
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="bg-foreground/5 border border-border/60 px-1.5 rounded">
                    esc
                  </kbd>
                  <span>close</span>
                </span>
              </div>
              <span class="text-sm text-foreground/60 hidden sm:inline">
                QueryEditor Docs
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
