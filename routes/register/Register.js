import { User } from '../../utils/database/models.js'

const registerSubmit = async (req, res) => {
  const {
    name, username, email, password
  } = req.body
  const user = new User({
    name,
    username,
    email,
    password,
  })
  try {
    await user.save()
    res.redirect('/login')
  } catch (err) {
    res.status(400).send(err)
  }
}

const renderRegisterPage = async (req, res) => {
  // check if user is already logged in
  if (req.session.loggedin) {
    res.redirect('/')
  } else {
    res.render('register', { title: 'Register', layout: 'layouts/main' })
  }
}

export { registerSubmit, renderRegisterPage }
