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

interface SearchIndexNode {
  id: string
  title: string
  description: string
  icon?: string
  href: string
  toc: Array<{ id: string; text: string; depth: number }>
  rawContent: string
}

let searchIndexCache: SearchIndexNode[] | null = null

async function loadSearchIndex(): Promise<SearchIndexNode[]> {
  if (searchIndexCache) return searchIndexCache
  try {
    const response = await fetch(`${basePath}/api/search-index.json`)
    if (!response.ok) throw new Error('Search index failed to load')
    const data = await response.json()
    searchIndexCache = Array.isArray(data) ? data : []
    return searchIndexCache
  } catch (error) {
    console.error('Failed to fetch search index:', error)
    return []
  }
}

function extractHeadingContent(
  rawContent: string,
  headingText: string,
  maxLength = 200
) {
  const lines = rawContent.split('\n')
  const headingPattern = /^#{1,6}\s+/
  let headingIndex = -1
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (
      headingPattern.test(line) &&
      line.replace(headingPattern, '').trim().toLowerCase() ===
        headingText.toLowerCase()
    ) {
      headingIndex = i
      break
    }
  }
  if (headingIndex === -1) return ''
  const contentLines: string[] = []
  for (let i = headingIndex + 1; i < lines.length; i++) {
    if (headingPattern.test(lines[i])) break
    contentLines.push(lines[i])
  }
  const text = contentLines
    .join(' ')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, (m) => m.slice(1, -1))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > maxLength
    ? text.slice(0, maxLength).trimEnd() + '\u2026'
    : text
}

function searchContentLocal(
  nodes: SearchIndexNode[],
  query: string
): SearchResult[] {
  if (!query || query.trim() === '') return []
  const lowerQuery = query.toLowerCase()
  const results: SearchResult[] = []

  for (const node of nodes) {
    const title = (node.title || '').toLowerCase()
    const description = (node.description || '').toLowerCase()
    const content = (node.rawContent || '').toLowerCase()

    let pageScore = 0
    if (title.includes(lowerQuery)) pageScore += 10
    if (description.includes(lowerQuery)) pageScore += 5
    const contentMatches = content.split(lowerQuery).length - 1
    pageScore += contentMatches

    const matchingHeadings: any[] = []
    for (const tocItem of node.toc || []) {
      if (tocItem.text.toLowerCase().includes(lowerQuery)) {
        const headingScore = tocItem.depth <= 2 ? 4 : 2
        const headingType = tocItem.depth === 1 ? 'title' : 'subtitle'
        const excerpt = extractHeadingContent(
          node.rawContent || '',
          tocItem.text,
          200
        )
        matchingHeadings.push({
          id: `${node.id}#${tocItem.id}`,
          title: tocItem.text,
          href: `${node.href}#${tocItem.id}`,
          type: headingType,
          content: excerpt,
          matchScore: headingScore
        })
        pageScore += headingScore
      }
    }

    if (pageScore > 0) {
      results.push({
        id: node.id,
        title: node.title,
        description: node.description,
        icon: node.icon,
        href: node.href,
        matchScore: pageScore,
        children: matchingHeadings
      })
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore)
}

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
      const nodes = await loadSearchIndex()
      const data = searchContentLocal(nodes, trimmed)
      setResults(data)
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
    delay: 50
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
        loadSearchIndex()
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadSearchIndex()
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      document.body.style.overflow = 'hidden'
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () =>
        document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (flatItems.length > 0 && selectedIndex >= 0) {
      const el = document.getElementById(flatItems[selectedIndex]?.id || '')
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex, flatItems])

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
          onClick={() => {
            setIsOpen(true)
            loadSearchIndex()
          }}
          onMouseEnter={() => loadSearchIndex()}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Search documentation (Press Ctrl+K or Cmd+K to open)"
          class="flex items-center justify-between w-full rounded-full border border-border/70 bg-foreground/2 hover:bg-foreground/5 hover:border-border/90 px-3 py-2  text-foreground/60 hover:text-foreground transition-all group shadow-2xs cursor-pointer"
        >
          <div class="flex items-center gap-2.5">
            <SearchIcon
              width={20}
              height={20}
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
          aria-label="Documentation search"
        >
          <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none"
            aria-hidden="true"
          />

          <div
            ref={dialogRef}
            class="w-full max-w-2xl bg-background border border-border/80 rounded-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,1)] shadow-[0_20px_40px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150 relative z-10"
          >
            <div class="flex items-center px-4 border-b border-border/60 relative bg-foreground/1">
              <SearchIcon
                width={18}
                height={18}
                class="text-foreground/40 shrink-0 mr-3"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onInput={(e) =>
                  onInputChange((e.target as HTMLInputElement).value)
                }
                placeholder="Search documentation, guides, and features..."
                class="w-full py-4 text-base bg-transparent border-none outline-none text-foreground placeholder:text-foreground/35 font-normal"
                role="combobox"
                aria-expanded={flatItems.length > 0}
                aria-controls="search-results-list"
                aria-autocomplete="list"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => onInputChange('')}
                  class="p-1 rounded-md text-foreground/40 hover:text-foreground hover:bg-foreground/5 mr-2 transition-colors cursor-pointer"
                >
                  <CloseIcon width={16} height={16} />
                </button>
              )}
              <kbd
                onClick={() => setIsOpen(false)}
                class="hidden sm:inline-block text-[11px] font-mono font-medium text-foreground/45 border border-border/60 bg-foreground/5 rounded px-1.5 py-0.5 shadow-2xs cursor-pointer hover:bg-foreground/10"
              >
                ESC
              </kbd>
            </div>

            <div
              id="search-results-list"
              role="listbox"
              class="overflow-y-auto p-2 max-h-[60vh] space-y-1"
            >
              {loading && (
                <div class="py-12 flex flex-col items-center justify-center gap-2 text-foreground/50 text-sm">
                  <div class="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span>Searching documentation...</span>
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
                        key={item.id}
                        className={cn({
                          'ml-5 pl-2 border-l border-border/40': item.isSubItem
                        })}
                      >
                        <a
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
