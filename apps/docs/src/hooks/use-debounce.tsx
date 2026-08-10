import { useEffect, useRef, useState } from 'preact/hooks'

interface UseDebounceOptions<T> {
  onDebounced: (value: T) => void
  delay?: number
}

export default function useDebounce<T>({
  onDebounced,
  delay = 300,
}: UseDebounceOptions<T>) {
  const [value, setValue] = useState<T>()
  const [debouncedValue, setDebouncedValue] = useState<T>()
  const callback = useRef(onDebounced)

  callback.current = onDebounced

  useEffect(() => {
    if (value === undefined) {
      setDebouncedValue(undefined)
      return
    }

    const timeout = setTimeout(() => {
      callback.current(value)
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timeout)
  }, [value, delay])

  return [debouncedValue, setValue] as const
}
