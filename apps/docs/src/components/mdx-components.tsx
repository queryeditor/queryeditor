import Heading, { type HeadingProps } from './heading'
import Image from './image'
import WaitlistForm from './waitlist-form'

export default {
  h1: (props: HeadingProps) => <Heading as="h1" {...props} />,
  h2: (props: HeadingProps) => <Heading as="h2" {...props} />,
  h3: (props: HeadingProps) => <Heading as="h3" {...props} />,
  h4: (props: HeadingProps) => <Heading as="h4" {...props} />,
  h5: (props: HeadingProps) => <Heading as="h5" {...props} />,
  h6: (props: HeadingProps) => <Heading as="h6" {...props} />,
  table: (props: any) => (
    <table {...props} className="w-full mt-5 *:text-left" />
  ),
  thead: (props: any) => (
    <thead {...props} className="border-b bg-foreground/5" />
  ),
  th: (props: any) => (
    <th
      {...props}
      className="py-3 uppercase text-xs first:pl-3 font-semibold text-foreground/70"
    />
  ),
  tbody: (props: any) => <tbody {...props} className="divide-y" />,
  tr: (props: any) => <tr {...props} />,
  td: (props: any) => (
    <td
      {...props}
      className="py-3 first:pl-3 first:text-foreground first:font-semibold text-foreground/80"
    />
  ),
  ul: (props: any) => (
    <ul
      {...props}
      className="[&>li]:mb-1 [&>li]:pl-2 pl-6 mt-5 [&>li]:list-disc text-foreground/90"
    />
  ),
  li: (props: any) => <li {...props} />,
  ol: (props: any) => (
    <ol
      {...props}
      className="[&>li]:mb-1 [&>li]:pl-2 pl-6 mt-5 [&>li]:list-decimal text-foreground/90"
    />
  ),
  p: (props: any) => <p {...props} className="first:mt-0 mt-[1lh]" />,
  a: (props: any) => (
    <a
      title={props?.title ?? props?.href}
      {...props}
      className="underline underline-offset-2 hover:text-foreground"
    />
  ),
  Link: (props: any) => (
    <a
      title={props?.title ?? props?.href}
      {...props}
      className="underline underline-offset-2 hover:text-foreground"
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      {...props}
      className="border-l-2 pl-3 border-foreground/20 my-3 italic"
    />
  ),
  code: (props: any) => (
    <code
      {...props}
      className="font-mono border bg-border/50 rounded-sm p-1 py-px text-foreground/70"
    />
  ),
  pre: (props: any) => <pre {...props} className="overflow-auto" />,
  strong: (props: any) => <strong {...props} className="font-semibold" />,
  Image: Image,
  img: Image,
  WaitlistForm: WaitlistForm
}
