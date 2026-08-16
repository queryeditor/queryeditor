import Heading, { type HeadingProps } from './heading'
import Image from './image'

export default {
  h1: (props: HeadingProps) => <Heading as="h1" {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" {...props} />,
  h4: (props: HeadingProps) => <Heading as="h4" {...props} />,
  h5: (props: HeadingProps) => <Heading as="h5" {...props} />,
  h6: (props: HeadingProps) => <Heading as="h6" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto my-6 border rounded-xl border-border/60 shadow-xs bg-foreground/1">
      <table {...props} className="w-full text-left text-sm border-collapse" />
    </div>
  ),
  thead: (props: any) => (
    <thead {...props} className="border-b border-border/60 bg-foreground/4" />
  ),
  th: (props: any) => (
    <th
      {...props}
      className="py-3 px-4 uppercase text-xs tracking-wider font-semibold text-foreground/75"
    />
  ),
  tbody: (props: any) => (
    <tbody {...props} className="divide-y divide-border/30" />
  ),
  tr: (props: any) => (
    <tr {...props} className="hover:bg-foreground/2 transition-colors" />
  ),
  td: (props: any) => (
    <td
      {...props}
      className="py-3 px-4 text-[13.5px] text-foreground/80 first:font-medium first:text-foreground"
    />
  ),
  ul: (props: any) => (
    <ul
      {...props}
      className="my-4 pl-6 space-y-1.5 list-disc marker:text-foreground/40 text-foreground/90 text-[15px]"
    />
  ),
  li: (props: any) => <li {...props} className="leading-7 pl-1" />,
  ol: (props: any) => (
    <ol
      {...props}
      className="my-4 pl-6 space-y-1.5 list-decimal marker:text-foreground/50 marker:font-medium text-foreground/90 text-[15px]"
    />
  ),
  p: (props: any) => (
    <p {...props} className="my-4 leading-7 text-[15px] text-foreground/85" />
  ),
  a: (props: any) => (
    <a
      title={props?.title ?? props?.href}
      {...props}
      className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors font-medium"
    />
  ),
  Link: (props: any) => (
    <a
      title={props?.title ?? props?.href}
      {...props}
      className="text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors font-medium"
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      {...props}
      className="border-l-2 border-accent bg-accent/4 rounded-r-xl px-4 py-3 my-5 text-foreground/85 not-italic [&>p]:my-0"
    />
  ),
  code: (props: any) => (
    <code
      {...props}
      className="font-mono text-[13px] px-1.5 py-0.5 rounded-md bg-foreground/6 border border-border/40 text-foreground/90 font-medium"
    />
  ),
  pre: (props: any) => (
    <pre
      {...props}
      className="my-6 p-4 rounded-xl border border-border/60 bg-foreground/3 overflow-x-auto text-[13px] leading-relaxed font-mono"
    />
  ),
  strong: (props: any) => (
    <strong {...props} className="font-semibold text-foreground" />
  ),
  Image: Image,
  img: Image
}
