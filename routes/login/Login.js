import { User } from '../../utils/database/models.js'

const renderLoginPage = async (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/')
  } else {
    res.render('login', { title: 'Login', layout: 'layouts/main' })
  }
}
const loginSubmit = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email, password })
  if (user) {
    req.session.loggedin = true
    req.session.user = user
    res.json({ status: 'success', message: 'Login success' })
    // res.redirect('/')
  } else {
    res.json({ status: 'error', message: 'Incorrect email or password' })
  }
}
export { renderLoginPage, loginSubmit }
