const API_URL = import.meta.env.VITE_API_URL

async function request(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`)
  }

  return response.json()
}

export function getAgents() {
  return request('/agents')
}

export function getActions() {
  return request('/actions?limit=100')
}

export function getViolations() {
  return request('/violations')
}