import { toChildArray, isValidElement, type ComponentChildren } from 'preact'

export default function getText(children: ComponentChildren): string {
  return toChildArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child)
      }

      if (isValidElement(child)) {
        return getText(child.props.children)
      }

      return ''
    })
    .join('')
}
