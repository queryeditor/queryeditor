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
    <figure className="md:px-4 group figure__container first:mt-0 mt-10">
      <span class="opacity-0 transition-opacity bg-white/60 backdrop-blur-sm figure__overlay z-10 fixed dark:bg-black/80 pointer-events-none inset-0 group-data-open:pointer-events-auto group-data-open:opacity-100" />
      <picture>
        {darksrc && (
          <source srcset={darksrc} media="(prefers-color-scheme: dark)" />
        )}
        <img
          {...props}
          loading="lazy"
          decoding="async"
          className={cn(
            'rounded-xl w-fit transition-all mx-auto cursor-zoom-in figure__image border dark:drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] drop-shadow-[0_15px_20px_rgba(0,0,0,0.2)]',
            props.className
          )}
          alt={props.alt ?? props.title ?? 'Documentation visual'}
        />
      </picture>

      {caption && (
        <figcaption className="pt-10 figure__caption w-full text-xs text-foreground/70 mx-auto text-center max-w-xs">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
