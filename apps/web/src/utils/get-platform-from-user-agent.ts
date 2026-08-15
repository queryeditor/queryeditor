export default (userAgent: string) => {
  const isMobileOrTablet =
    /mobile|tablet|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    )
  if (isMobileOrTablet) return 'other'

  if (userAgent.includes('mac') || userAgent.includes('darwin')) return 'mac'
  if (userAgent.includes('win')) return 'windows'
  if (userAgent.includes('linux') || userAgent.includes('x11')) return 'linux'
  return 'other'
}
