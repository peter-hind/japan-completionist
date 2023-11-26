import express from 'express'
import { fetchFeature, visitFeature, fetchVisitorFeatures } from '../db/db'

const router = express.Router()
const layer = 'onsens100'

router.get('/:title', async (req, res) => {
  try {
    const title = req.params.title
    const onsen = await fetchFeature(title, layer)

    if (!onsen) {
      res.status(404).json({ message: 'Onsen not found' })
      return
    }
    res.status(200).json(onsen)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting Onsens',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.get('/user/:sub', async (req, res) => {
  try {
    const sub = req.params.sub
    console.log(sub)
    const onsens = await fetchVisitorFeatures(layer, sub)
    if (!onsens) {
      res.status(404).json({ message: 'Onsens not found' })
      return
    }
    res.status(200).json(onsens)
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
  const onsen = req.body.feature
  const newVisit = await visitFeature(layer, currentUser, onsen)
  if (!newVisit) {
    res.status(404).json({ message: 'Something went wrong' })
    return
  }
  res.status(200).json(newVisit)
})

export default router
