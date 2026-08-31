async function request(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export function listSubjects() {
  return request('/api/subjects')
}

export function getSubject(id) {
  return request(`/api/subjects/${id}`)
}

export function createSubject(subject) {
  return request('/api/subjects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subject),
  })
}

export function saveSubject(subject) {
  return request(`/api/subjects/${subject.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subject),
  })
}

export function deleteSubject(id) {
  return request(`/api/subjects/${id}`, { method: 'DELETE' })
}

export function getTracker() {
  return request('/api/tracker')
}

export function saveTracker(tracker) {
  return request('/api/tracker', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tracker),
  })
}

export async function uploadAsset(subjectId, file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`/api/subjects/${subjectId}/assets`, { method: 'POST', body: form })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Upload failed: ${res.status}`)
  }
  return res.json()
}
