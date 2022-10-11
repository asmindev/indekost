import { Kost } from '../../utils/database/models.js'

const Home = async (req, res) => {
  if (req.session.loggedin) {
    const { user } = req.session
    const kosts = await Kost.find()
    res.render('index', {
      title: 'Home', layout: 'layouts/main', user, kosts
    })
  } else {
    res.redirect('/login')
  }
}

export { Home }
