import { NETWORK_TYPE } from './constants'

const isIpv4Netblock = (entry) => {
  const ipv4 = entry.split('/')[0]
  const pfxLen = parseInt(entry.split('/')[1])
  if (!isIPv4(ipv4) || isNaN(pfxLen) || pfxLen < 1 || pfxLen > 32) return false
  return true
}

const isIpv6Netblock = (entry) => {
  const ipv6 = entry.split('/')[0]
  const pfxLen = parseInt(entry.split('/')[1])
  if (!isIPv6(ipv6) || isNaN(pfxLen) || pfxLen < 1 || pfxLen > 128) return false
  return true
}

const isDomain = (entry) => {
  if (entry.endsWith('.txt')) {
    return false
  }
  const domainPattern =
    /^(?:[a-zA-Z0-9_](?:[a-zA-Z0-9-_]{0,61}[a-zA-Z0-9_])?\.)+(?:[A-Z]{2,6}|[a-zA-Z]{2,})\.?$/i
  return domainPattern.test(entry)
}

const isASN = (entry) => {
  return /as\d{1,8}$/i.test(entry)
}

const isIPv4 = (value) => {
  const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/
  if (ipv4Regex.test(value)) {
    return true
  }
  return false
}
const isIPv6 = (value) => {
  const ipv6Regex =
    /^(([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,7}:|([0-9a-f]{1,4}:){1,6}:[0-9a-f]{1,4}|([0-9a-f]{1,4}:){1,5}(:[0-9a-f]{1,4}){1,2}|([0-9a-f]{1,4}:){1,4}(:[0-9a-f]{1,4}){1,3}|([0-9a-f]{1,4}:){1,3}(:[0-9a-f]{1,4}){1,4}|([0-9a-f]{1,4}:){1,2}(:[0-9a-f]{1,4}){1,5}|[0-9a-f]{1,4}:((:[0-9a-f]{1,4}){1,6})|:((:[0-9a-f]{1,4}){1,7}|:)|fe80:(:[0-9a-f]{0,4}){0,4}%[0-9a-z]+|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}\d|)\d)\.){3,3}(25[0-5]|(2[0-4]|1{0,1}\d|)\d)|([0-9a-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}\d|)\d)\.){3,3}(25[0-5]|(2[0-4]|1{0,1}\d|)\d))$/i
  if (ipv6Regex.test(value)) {
    return true
  }
  return false
}

export const getNetworkType = (resource) => {
  switch (true) {
    case isASN(resource):
      return NETWORK_TYPE.ASN
    case isIPv4(resource):
      return NETWORK_TYPE.IPV4
    case isIPv6(resource):
      return NETWORK_TYPE.IPV6
    case isDomain(resource):
      return NETWORK_TYPE.DOMAIN
    case isIpv4Netblock(resource):
      return NETWORK_TYPE.IPV4_NETBLOCK
    case isIpv6Netblock(resource):
      return NETWORK_TYPE.IPV6_NETBLOCK
    default:
      throw new Error(`Wrong type for network: ${resource}`)
  }
}
