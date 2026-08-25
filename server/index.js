import express from 'express'
import multer from 'multer'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { promises as fs } from 'node:fs'
import {
  DATA_DIR,
  listSubjects,
  readSubject,
  writeSubject,
  createSubjectDir,
  deleteSubjectDir,
  ensureAssetsDir,
} from './store.js'

const PORT = process.env.PORT || 4001

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use('/api/assets', express.static(DATA_DIR))

async function findDirById(id) {
  const subjects = await listSubjects()
  const match = subjects.find((s) => s.id === id)
  return match?.dirName ?? null
}

app.get('/api/subjects', async (req, res) => {
  const subjects = await listSubjects()
  res.json(subjects)
})

app.get('/api/subjects/:id', async (req, res) => {
  const dirName = await findDirById(req.params.id)
  if (!dirName) return res.status(404).json({ error: 'Subject not found' })
  res.json(await readSubject(dirName))
})

app.post('/api/subjects', async (req, res) => {
  const { id, title, description, createdAt, updatedAt, chapters } = req.body
  const dirName = await createSubjectDir(title || 'Untitled')
  const subject = {
    id,
    dirName,
    title,
    description: description ?? '',
    createdAt,
    updatedAt,
    chapters: chapters ?? [],
  }
  await writeSubject(dirName, subject)
  res.status(201).json(subject)
})

app.put('/api/subjects/:id', async (req, res) => {
  const dirName = await findDirById(req.params.id)
  if (!dirName) return res.status(404).json({ error: 'Subject not found' })
  const subject = { ...req.body, id: req.params.id, dirName }
  await writeSubject(dirName, subject)
  res.json(subject)
})

app.delete('/api/subjects/:id', async (req, res) => {
  const dirName = await findDirById(req.params.id)
  if (!dirName) return res.status(404).json({ error: 'Subject not found' })
  await deleteSubjectDir(dirName)
  res.status(204).end()
})

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } })

app.post('/api/subjects/:id/assets', upload.single('file'), async (req, res) => {
  const dirName = await findDirById(req.params.id)
  if (!dirName) return res.status(404).json({ error: 'Subject not found' })
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

  const ext = path.extname(req.file.originalname || '') || '.png'
  const filename = `${randomUUID()}${ext}`
  const assetsDir = await ensureAssetsDir(dirName)
  await fs.writeFile(path.join(assetsDir, filename), req.file.buffer)

  res.status(201).json({ url: `/api/assets/${dirName}/assets/${filename}` })
})

app.listen(PORT, () => {
  console.log(`Study Ledger API listening on http://localhost:${PORT}`)
})
