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
const layer = 'castles100'

router.get('/:title', async (req, res) => {
  try {
    const title = req.params.title
    const castle = await fetchFeature(title, layer)

    if (!castle) {
      res.status(404).json({ message: 'Castle not found' })
      return
    }
    res.status(200).json(castle)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting Castles',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const castles = await fetchAllFeatures(layer)
    if (!castles) {
      res.status(404).json({ message: 'Castles not found' })
      return
    }
    res.status(200).json(castles)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting castles',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.get('/user/:sub', async (req, res) => {
  try {
    const sub = req.params.sub
    console.log(sub)
    const castles = await fetchVisitorFeatures(layer, sub)
    if (!castles) {
      res.status(404).json({ message: 'Castles not found' })
      return
    }
    res.status(200).json(castles)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting list',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  console.log(req.body)
  const currentUser = req.auth?.sub
  const castle = req.body.feature
  if (!currentUser) {
    res.status(404).json({ message: 'Not logged in!' })
    return
  }
  const newVisit = await visitFeature(layer, currentUser, castle)
  if (!newVisit) {
    res.status(404).json({ message: 'Something went wrong' })
    return
  }
  res.status(200).json(newVisit)
})

router.delete('/', checkJwt, async (req: JwtRequest, res) => {
  console.log(req.body)
  const currentUser = req.auth?.sub
  const castle = req.body.feature
  if (!currentUser) {
    res.status(404).json({ message: 'Not logged in!' })
    return
  }
  const removedCastle = await deleteFeature(layer, currentUser, castle)
  if (!removedCastle) {
    res.status(404).json({ message: 'Something went wrong' })
    return
  }
  res.status(200).json(removedCastle)
})

export default router
