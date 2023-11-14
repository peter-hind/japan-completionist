import express from 'express'
import { fetchMountain, climbMountain } from '../db/db'

const router = express.Router()

router.get('/:title', async (req, res) => {
  try {
    const title = req.params.title
    const mountain = await fetchMountain(title)

    if (!mountain) {
      res.status(404).json({ message: 'Mountain not found' })
      return
    }
    res.status(200).json(mountain)
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while getting posts',
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)
  const currentUser = req.body.sub
  const mountain = req.body.mountain
  const newClimb = await climbMountain(currentUser, mountain)
  if (!newClimb) {
    res.status(404).json({ message: 'Something went wrong' })
    return
  }
  res.status(200).json(newClimb)
})

export default router
