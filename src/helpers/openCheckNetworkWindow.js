export function openCheckNetworkWindow(domain) {
  const url = `${window.location.origin}/checkNetwork?network=${encodeURIComponent(domain)}`
  window.open(url, '_blank')
}
