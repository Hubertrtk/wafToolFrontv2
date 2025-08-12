export const SERVICE_ACTIONS = {
  // ustawia status jako allow
  ALLOW: 'allow',
  //ustawia status jako block
  BLOCK: 'block',
  //ustawia status tego resource jako remove - resource zostanie wyrzucony z allow oraz block
  REMOVE: 'remove',
  DIS_ALLOW: 'disallow',
  DIS_BLOCK: 'disblock',
}

export const OVERLAPPING_NETWORK_PRIORITY = {
  LOWER_PRIORITY: 'lower_priority',
  HIGHER_PRIORITY: 'higher_priority',
}

export const NETWORK_TYPE = {
  ASN: 'asn',

  IPV4: 'ipv4',
  IPV6: 'ipv6',

  DOMAIN: 'domain',

  IPV4_NETBLOCK: 'ipv4_netblock',
  IPV6_NETBLOCK: 'ipv6_netblock',
}
