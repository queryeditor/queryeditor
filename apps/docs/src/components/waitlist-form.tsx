interface Props {
  platform: string
  id?: string
}

export default function WaitlistForm({ platform, id }: Props) {
  const subject = encodeURIComponent(`Waitlist: QueryEditor for ${platform}`)
  const body = encodeURIComponent(
    `I'd like to be notified when QueryEditor is available for ${platform}.`
  )

  return (
    <form
      id={id}
      class="mt-5 flex flex-col sm:flex-row gap-2 max-w-sm waitlist-form"
      data-platform={platform}
      data-subject={subject}
      data-body={body}
    >
      <input
        type="email"
        required
        name="email"
        placeholder="your@email.com"
        class="flex-1 rounded-sm border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/30"
      />
      <button
        type="submit"
        class="rounded-sm border bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition-colors cursor-pointer"
      >
        Notify me
      </button>
    </form>
  )
}
