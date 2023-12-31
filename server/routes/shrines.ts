import express from 'express'
import {
  fetchFeature,
  visitFeature,
  fetchVisitorFeatures,
  deleteFeature,
  fetchAllFeatures,
} from '../db/db'
import checkJwt, { JwtRequest } from '../auth0'

const router = express.Router()
const layer = 'shrines100'

router.get('/:title', async (req, res) => {
  try {
    const title = req.params.title
    const shrine = await fetchFeature(title, layer)

    if (!shrine) {
      res.status(404).json({ message: 'Shrine not found' })
      return
    }
    res.status(200).json(shrine)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting Shrines',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const shrines = await fetchAllFeatures(layer)
    if (!shrines) {
      res.status(404).json({ message: 'Shrines not found' })
      return
    }
    res.status(200).json(shrines)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting shrines',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.get('/user/:sub', async (req, res) => {
  try {
    const sub = req.params.sub
    console.log(sub)
    const shrines = await fetchVisitorFeatures(layer, sub)
    if (!shrines) {
      res.status(404).json({ message: 'Shrines not found' })
      return
    }
    res.status(200).json(shrines)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting list',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const currentUser = req.auth?.sub
  const shrine = req.body.feature
  if (!currentUser) {
    res.status(404).json({ message: 'Not logged in!' })
    return
  }
  const newVisit = await visitFeature(layer, currentUser, shrine)
  if (!newVisit) {
    res.status(404).json({ message: 'Something went wrong' })
    return
  }
  res.status(200).json(newVisit)
})

router.delete('/', checkJwt, async (req: JwtRequest, res) => {
  console.log(req.body)
  const currentUser = req.auth?.sub
  const shrine = req.body.feature
  if (!currentUser) {
    res.status(404).json({ message: 'Not logged in!' })
    return
  }
  const removedShrine = await deleteFeature(layer, currentUser, shrine)
  if (!removedShrine) {
    res.status(404).json({ message: 'Something went wrong' })
    return
  }
  res.status(200).json(removedShrine)
})

export default router
