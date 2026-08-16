import { cn } from '@queryeditor/shared/lib/cn'
import { type JSX } from 'preact'

export default function Image({
  darksrc,
  caption,
  ...props
}: JSX.IntrinsicElements['img'] & {
  darksrc?: string
  caption?: string
}) {
  return (
    <figure className="my-8 group figure__container first:mt-0">
      <span class="opacity-0 transition-opacity duration-300 bg-black/60 backdrop-blur-md figure__overlay z-50 fixed pointer-events-none inset-0 group-data-open:pointer-events-auto group-data-open:opacity-100" />
      <div className="overflow-hidden w-fit rounded-[1.2rem] border border-border/70 bg-foreground/2 p-1 md:p-2 shadow-xs transition-shadow hover:shadow-md">
        <picture>
          {darksrc && (
            <source srcset={darksrc} media="(prefers-color-scheme: dark)" />
          )}
          <img
            {...props}
            loading="lazy"
            decoding="async"
            className={cn(
              'rounded-xl max-md:w-full h-auto transition-transform duration-300 cursor-zoom-in figure__image border border-border/40 dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] shadow-[0_4px_16px_rgba(0,0,0,0.08)]',
              props.className
            )}
            alt={props.alt ?? props.title ?? 'Documentation visual'}
          />
        </picture>
      </div>

      {caption && (
        <figcaption className="pt-3 figure__caption w-full text-xs text-foreground/60 mx-auto text-center max-w-md leading-normal">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
