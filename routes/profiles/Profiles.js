import { User } from '../utils/database/models.js'

const Profiles = async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username })
  if (user) {
    res.render('profile', { title: 'Profile', layout: 'layouts/main', user })
  } else {
    next()
  }
}

export { Profiles }
