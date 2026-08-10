import type { SVGProps } from "preact/compat";

export function Search(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M10 4a6 6 0 1 0 0 12a6 6 0 0 0 0-12m-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10" /></svg>
  )
}


export function Document(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M7 12.25a.75.75 0 1 1 1.5 0a.75.75 0 0 1-1.5 0m.75 2.25a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5M7 18.25a.75.75 0 1 1 1.5 0a.75.75 0 0 1-1.5 0m3.75-6.75a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zM10 15.25a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75m.75 2.25a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zm8.664-9.086l-5.829-5.828A2.05 2.05 0 0 0 12.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.828a2 2 0 0 0-.586-1.414M18.5 20a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5h6V8a2 2 0 0 0 2 2h4.5zm-5-15.379L17.378 8.5H14a.5.5 0 0 1-.5-.5z" /></svg>
  )
}


export function NumberSymbol(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M10.987 2.89a.75.75 0 1 0-1.474-.28L8.494 7.999L3.75 8a.75.75 0 1 0 0 1.5l4.46-.002l-.946 5l-4.514.002a.75.75 0 0 0 0 1.5l4.23-.002l-.967 5.116a.75.75 0 1 0 1.474.278l1.02-5.395l5.474-.002l-.968 5.119a.75.75 0 1 0 1.474.278l1.021-5.398l4.742-.002a.75.75 0 1 0 0-1.5l-4.458.002l.946-5l4.512-.002a.75.75 0 1 0 0-1.5l-4.229.002l.966-5.104a.75.75 0 0 0-1.474-.28l-1.018 5.385l-5.474.002zm-1.25 6.608l5.474-.003l-.946 5l-5.474.002z" /></svg>
  )
}
