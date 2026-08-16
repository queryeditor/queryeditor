import { type ComponentChildren, type JSX } from 'preact'

import getText from '@/utils/get-text-by-children'
import { slugify } from 'slugtree'

export type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export type HeadingProps<T extends HeadingTag = HeadingTag> = {
  as?: T
  children?: ComponentChildren
} & JSX.IntrinsicElements[T]

export default function Heading<T extends HeadingTag = 'h2'>({
  as,
  children,
  ...props
}: HeadingProps<T>) {
  const Tag = (as ?? 'h2') as HeadingTag
  const childrenText = getText(children)

  const id = slugify(childrenText)

  return (
    <Tag {...props} id={id}>
      <a
        href={`#${id}`}
        aria-label={`Link to section: ${childrenText}`}
        className="group prose__heading inline-flex items-center gap-2 relative no-underline hover:no-underline"
      >
        <span className="relative inline-flex">
          {childrenText}
          <span className="absolute inset-y-0 -inset-x-1 pointer-events-none rounded duration-500 bg-accent/15 w-0 group-data-highlighted:w-[calc(100%+0.5rem)] transition-all" />
        </span>
        <span
          className="prose__heading__icon text-foreground/40 hover:text-foreground opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-all p-1 rounded-md hover:bg-foreground/5 inline-flex items-center justify-center cursor-pointer"
          data-slug-id={id}
          title="Copy link to heading"
          aria-hidden="true"
        >
          <svg
            class="copy-icon size-4 group-data-copied:hidden"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M8.5 8.5H6.25a1.75 1.75 0 0 0-1.75 1.75v7.5c0 .966.784 1.75 1.75 1.75h5c.882 0 1.61-.652 1.73-1.5h1.51a3.25 3.25 0 0 1-3.24 3h-5A3.25 3.25 0 0 1 3 17.75v-7.5A3.25 3.25 0 0 1 6.25 7H8.5zM17.75 3A3.25 3.25 0 0 1 21 6.25v7.5A3.25 3.25 0 0 1 17.75 17h-5a3.25 3.25 0 0 1-3.25-3.25v-7.5A3.25 3.25 0 0 1 12.75 3zm-5 1.5A1.75 1.75 0 0 0 11 6.25v7.5c0 .966.784 1.75 1.75 1.75h5a1.75 1.75 0 0 0 1.75-1.75v-7.5a1.75 1.75 0 0 0-1.75-1.75z"
            />
          </svg>
          <svg
            class="check-icon size-4 hidden group-data-copied:inline-flex text-emerald-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M9.854 3.146a.5.5 0 0 1 0 .708l-4.5 4.5a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L5 7.293l4.146-4.147a.5.5 0 0 1 .708 0"
            />
          </svg>
        </span>
      </a>
    </Tag>
  )
}
