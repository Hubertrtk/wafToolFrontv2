import axiosInstance from './axios'

export const checkIp = (ip) => {
  return axiosInstance.post(`/CheckIp`, {
    method: 'IDENTIFY',
    args: ip,
  })
}

export const login = () => {
  return axiosInstance.post(`/login`)
}

export const getUnidentifiedDomains = () => {
  return axiosInstance.post(`/DomainIdentification`, {
    method: 'GET_UNIDENTIFIED',
    args: null,
  })
}

export const domainIdentification = (domains) => {
  return axiosInstance.post(`/DomainIdentification`, {
    method: 'IDENTIFY',
    args: domains,
  })
}

export const searchNetwork = (value) => {
  return axiosInstance.post(`/SearchNetwork`, {
    method: 'IDENTIFY',
    args: value,
  })
}

export const checkServiceNetwork = (value) => {
  return axiosInstance.post(`/checkServiceNetwork`, {
    method: 'IDENTIFY',
    args: value,
  })
}

export const manualUnblocking = (networks) => {
  return axiosInstance.post(`/ManualUnblocking`, {
    method: 'IDENTIFY',
    args: networks,
  })
}

export const identifyNetworks = (networks) => {
  return axiosInstance.post(`/IdentifyNetworks`, {
    method: 'IDENTIFY',
    args: networks,
  })
}

export const getGlobalBlockAzureNetworks = () => {
  return axiosInstance.post(`/GlobalBlockAzure`, {
    method: 'GET_NETWORKS',
    args: [],
  })
}

/**
 * @param {*} networks {"network": "ovh.net", "status": "remove", "priority": "higher_priority"}
 * @returns
 */
export const globalBlockAzureNetworks = (networks) => {
  return axiosInstance.post(`/GlobalBlockAzure`, {
    method: 'BLOCK_NETWORKS',
    args: networks,
  })
}

export const getTemplate = (templateFileName) => {
  return axiosInstance.post(`/Template`, {
    method: 'GET_TEMPLATE',
    args: templateFileName,
  })
}

export const getTemplates = () => {
  return axiosInstance.post(`/Template`, {
    method: 'GET_TEMPLATES',
    args: [],
  })
}

export const buildTemplate = (provider) => {
  return axiosInstance.post(`/Template`, {
    method: 'BUILD',
    args: provider,
  })
}

export const saveDbs = () => {
  return axiosInstance.post(`/DatabaseManager`, {
    method: 'SAVE_DATABASES',
    args: [],
  })
}
