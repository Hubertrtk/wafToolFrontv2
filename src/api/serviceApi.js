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
