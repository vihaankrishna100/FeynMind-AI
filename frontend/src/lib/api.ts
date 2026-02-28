const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function getErrorMessage(response: Response) {
  try {
    const data = await response.json()
    if (data?.detail) return `Failed: ${data.detail}`
  } catch {
    try {
      const text = await response.text()
      if (text) return `Failed: ${text}`
    } catch {
      return `Failed: ${response.status}`
    }
  }
  return `Failed: ${response.status}`
}

export async function generateQuiz(request: any) {
  const response = await fetch(`${API_BASE}/api/quiz`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }
  return response.json()
}

export async function feynmanChat(request: any) {
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }
  return response.json()
}

export async function saveMinutes(request: any) {
  const response = await fetch(`${API_BASE}/api/minutes`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }
  return response.json()
}

export async function saveAttempt(request: any) {
  const response = await fetch(`${API_BASE}/api/attempt`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request),
  })
  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }
  return response.json()
}
