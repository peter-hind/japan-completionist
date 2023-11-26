import express from 'express'
import { fetchFeature, visitFeature, fetchVisitorFeatures } from '../db/db'

const router = express.Router()
const layer = 'blossoms100'

router.get('/:title', async (req, res) => {
  try {
    const title = req.params.title
    const blossom = await fetchFeature(title, layer)

    if (!blossom) {
      res.status(404).json({ message: 'Blossom not found' })
      return
    }
    res.status(200).json(blossom)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting Blossoms',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.get('/user/:sub', async (req, res) => {
  try {
    const sub = req.params.sub
    console.log(sub)
    const blossoms = await fetchVisitorFeatures(layer, sub)
    if (!blossoms) {
      res.status(404).json({ message: 'Blossoms not found' })
      return
    }
    res.status(200).json(blossoms)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting list',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)
  const currentUser = req.body.sub
  const blossom = req.body.feature
  const newVisit = await visitFeature(layer, currentUser, blossom)
  if (!newVisit) {
    res.status(404).json({ message: 'Something went wrong' })
    return
  }
  res.status(200).json(newVisit)
})

export default router
