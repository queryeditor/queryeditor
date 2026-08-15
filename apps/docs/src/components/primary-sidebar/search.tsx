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
import path from '@/lib/path'

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
      const response = await fetch(path(`/api/search?query=${value}`))
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
      className="flex border border-transparent! hover:border-border! hover:bg-foreground/5 dark:hover:bg-foreground/10 rounded-xl items-center p-0.5 pl-0 text-left"
    >
      <div className="px-2">{icon}</div>
      <div>
        <span className="font-semibold">{title}</span>
        <p className="text-xs line-clamp-1 text-foreground/60">{description}</p>
      </div>
    </a>
  )

  return (
    <>
      <nav class="mt-0 md:mt-10 mb-3 relative px-2 w-full min-h-12 h-12">
        <label class="flex items-center h-full relative">
          <SearchIcon
            width={17}
            class="opacity-60 absolute inset-y-auto left-2"
          />
          <input
            ref={inputRef}
            onInput={(e) => setValue(e.currentTarget.value)}
            placeholder="Search..."
            class="relative text-base focus:outline-1 outline-accent search__trigger border shadow-[0_2px_5px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(0,0,0,0.3)] w-full rounded-xl py-2 px-8 pr-10 gap-2"
          />
          <span class="opacity-40 absolute inset-y-auto pointer-events-none right-3">
            ⌘+k
          </span>
        </label>
      </nav>

      {loading && !!debouncedValue && (
        <div className="grow grid text-sm text-foreground/60 place-content-center">
          Loading results...
        </div>
      )}

      {!loading && result?.length === 0 && !!debouncedValue && (
        <div className="grow grid text-sm text-foreground/60 place-content-center">
          No results found
        </div>
      )}

      <div
        hidden={!result || loading || result.length === 0 || hidden}
        className="flex flex-col px-2 gap-1 grow overflow-y-auto"
      >
        {result?.slice(0, 10).map((item, i) => {
          return (
            <Fragment>
              <Item
                key={i}
                icon={<Document width={20} className="opacity-50" />}
                title={item.title}
                description={item.description}
                href={item.href}
              />
              {item.children.length > 0 && (
                <div className="pl-3">
                  {item.children.map((sub) => (
                    <Item
                      key={i}
                      icon={<NumberSymbol width={20} className="text-accent" />}
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
