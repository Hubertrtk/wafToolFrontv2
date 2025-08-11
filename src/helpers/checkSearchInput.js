export function checkInputType(input) {
  if (!input || typeof input !== 'string') return null

  const trimmed = input.trim()

  // Sprawdzenie ASN (AS123 lub as123)
  const asnRegex = /^as\d+$/i
  if (asnRegex.test(trimmed)) {
    return 'ASN'
  }

  // Sprawdzenie IPv4
  const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/
  if (ipv4Regex.test(trimmed)) {
    return 'IPv4'
  }

  // Sprawdzenie IPv6
  const ipv6Regex =
    /^(([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,7}:|([0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|[0-9a-f]{1,4}:((:[0-9a-f]{1,4}){1,6})|:((:[0-9a-f]{1,4}){1,7}|:)|fe80:(:[0-9a-f]{0,4}){0,4}%[0-9a-z]+|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}\d|)\d)\.){3,3}(25[0-5]|(2[0-4]|1{0,1}\d|)\d)|([0-9a-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}\d|)\d)\.){3,3}(25[0-5]|(2[0-4]|1{0,1}\d|)\d))$/i
  if (ipv6Regex.test(trimmed)) {
    return 'IPv6'
  }

  return false // Nie pasuje do IP ani ASN
}
