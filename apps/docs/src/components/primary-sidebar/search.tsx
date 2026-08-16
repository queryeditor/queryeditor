import useDebounce from '@/hooks/use-debounce'
import { $ } from '@queryeditor/shared/lib/dom'
import { useState, useRef, useEffect } from 'preact/hooks'
import type { ReactNode } from 'preact/compat'
import { Fragment } from 'preact/jsx-runtime'
import type { SearchResult } from 'slugtree'

import {
  Document,
  NumberSymbol,
  Search as SearchIcon
} from '@/components/icons'

const rawBase =
  import.meta.env.PUBLIC_DOCS_BASE || import.meta.env.BASE_URL || ''
const basePath = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase

export default function Search() {
  const [result, setResult] = useState<SearchResult[]>()
  const [loading, setLoading] = useState(false)
  const [hidden, setHidden] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (value: string) => {
    const $treeContent = $('.tree__content')!

    if (!value) {
      $treeContent.hidden = false
      setResult([])
      setLoading(false)
      setHidden(false)
      return
    }

    try {
      setLoading(true)
      $treeContent.hidden = true
      const response = await fetch(`${basePath}/api/search?query=${value}`)
      const data = await response.json()
      setResult(data)
      setHidden(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const [debouncedValue, setValue] = useDebounce<string>({
    onDebounced: (value) => handleSearch(value)
  })

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const Item = ({
    icon,
    title,
    description,
    href
  }: {
    icon: ReactNode
    title: string
    description?: string | null
    href: string
  }) => (
    <a
      onClick={(e) => {
        setHidden(true)
      }}
      href={href}
      className="flex gap-2.5 border border-transparent hover:border-border/60 hover:bg-foreground/4 rounded-xl items-center p-2 text-left transition-all group"
    >
      <div className="text-foreground/40 group-hover:text-accent transition-colors shrink-0">
        {icon}
      </div>
      <div className="overflow-hidden">
        <span className="font-medium text-xs text-foreground group-hover:text-accent transition-colors block line-clamp-1">
          {title}
        </span>
        {description && (
          <p className="text-xs line-clamp-1 text-foreground/50 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </a>
  )

  return (
    <>
      <div class="px-3 pt-3 pb-2">
        <label class="flex items-center relative w-full rounded-xl border border-border/60 bg-foreground/2 hover:bg-foreground/4 focus-within:bg-background focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/15 transition-all">
          <SearchIcon
            width={15}
            height={15}
            class="opacity-50 absolute left-3 text-foreground"
          />
          <input
            ref={inputRef}
            onInput={(e) => setValue(e.currentTarget.value)}
            placeholder="Search docs..."
            class="text-sm w-full bg-transparent outline-none py-2 pl-9 pr-14 text-foreground placeholder:text-foreground/40"
          />
          <kbd class="pointer-events-none absolute right-2 font-mono text-[10px] font-medium text-foreground/50 border border-border/60 bg-foreground/5 rounded px-1.5 py-0.5 shadow-2xs">
            ⌘K
          </kbd>
        </label>
      </div>

      {loading && !!debouncedValue && (
        <div className="p-4 text-center text-xs text-foreground/50">
          Searching...
        </div>
      )}

      {!loading && result?.length === 0 && !!debouncedValue && (
        <div className="p-4 text-center text-xs text-foreground/50">
          No results found
        </div>
      )}

      <div
        hidden={!result || loading || result.length === 0 || hidden}
        className="flex flex-col px-3 gap-1 grow overflow-y-auto"
      >
        {result?.slice(0, 10).map((item, i) => {
          return (
            <Fragment key={i}>
              <Item
                icon={<Document width={18} height={18} />}
                title={item.title}
                description={item.description}
                href={item.href}
              />
              {item.children.length > 0 && (
                <div className="pl-3 space-y-0.5 border-l border-border/40 ml-2">
                  {item.children.map((sub, j) => (
                    <Item
                      key={j}
                      icon={<NumberSymbol width={16} height={16} />}
                      title={sub.title}
                      description={sub.content}
                      href={sub.href}
                    />
                  ))}
                </div>
              )}
            </Fragment>
          )
        })}
      </div>
    </>
  )
}
