const productionBaseUrl = 'https://multfilm-backend.onrender.com'

function isLocalBackendHost(hostname: string) {
  return hostname === 'localhost'
    || hostname === '127.0.0.1'
    || hostname === '0.0.0.0'
    || hostname === '::1'
    || hostname.startsWith('192.168.')
    || hostname.startsWith('10.')
    || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
}

export function getBaseUrl() {
  const hostname = window.location.hostname

  if (!isLocalBackendHost(hostname)) {
    return productionBaseUrl
  }

  const backendHost = hostname === '::1' ? '[::1]' : hostname

  return `http://${backendHost}:8080`
}
