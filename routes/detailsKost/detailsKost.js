import { Kost } from '../../utils/database/models.js'

export default async (req, res) => {
  const name = req.params.kostName
  const kost = await Kost.findOne({ name })
  res.status(200).json({ kost })
}
