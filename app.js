import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import fileUpload from 'express-fileupload'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import './utils/database/db.js'
import { User } from './utils/database/models.js'
const app = express()
const store = new session.MemoryStore()
const port = 3000

// use ejs as the view engine
app.set('view engine', 'ejs')

// use express middleware
app.use(expressLayouts) // use express-ejs-layouts
app.use(fileUpload()) // use express-fileupload
app.use(express.static('public')) // use static files
app.use(express.urlencoded({ extended: true })) // use body-parser
app.use(cookieParser()) // use cookie-parser
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
)

// // render the index page

app.get('/', (req, res) => {
  if (req.session.loggedin) {
    const { user } = req.session
    res.render('index', { title: 'Home', layout: 'layouts/main', user })
  } else {
    res.redirect('/login')
  }
})

// register a new user
app.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body
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
})

app.get('/register', async (req, res) => {
  //check if user is already logged in
  console.log(req.session.loggedin)
  if (req.session.loggedin) {
    res.redirect('/')
  } else {
    res.render('register', { title: 'Register', layout: 'layouts/main' })
  }
})

// login a user
app.get('/login', (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/')
  } else {
    res.render('login', { title: 'Login', layout: 'layouts/main' })
  }
})
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email, password })
  if (user) {
    req.session.loggedin = true
    req.session.user = user
    res.redirect(`${user.username}`)
  } else {
    res.json({ message: 'Invalid email or password' })
  }
})

// profile page
// get the user's profile
// and render the profile page
// with the user's data

// handle when upload file
app.post('/upload', (req, res) => {
  const file = req.files.file
  const fileName = file.name
  const fileExtension = fileName.split('.').pop()
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']
  if (allowedExtensions.includes(fileExtension)) {
    file.mv(`public/uploads/${fileName}`, (err) => {
      if (err) {
        console.log(err)
        res.send(err)
      } else {
        res.send('File uploaded!')
      }
    })
  } else {
    res.send('File extension not allowed!')
  }
})
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})
app.get('/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
  if (user) {
    res.render('profile', { title: 'Profile', layout: 'layouts/main', user })
  } else {
    res.status(404).render('404', { title: '404', layout: 'layouts/main' })
  }
})

// start the server
app.listen(port, () => {
  console.log(`indekost app listening at http://localhost:${port}`)
})
