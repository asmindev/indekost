import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import fileUpload from 'express-fileupload'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import './utils/database/db.js'
import { User, Kost } from './utils/database/models.js'

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
    saveUninitialized: true,
    store,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
)
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.setHeader('Pragma', 'no-cache');
  next();
});

// // render the index page

app.get('/', async (req, res) => {
  if (req.session.loggedin) {
    const { user } = req.session
    const kosts = await Kost.find()
    res.render('index', {
      title: 'Home', layout: 'layouts/main', user, kosts
    })
  } else {
    res.redirect('/login')
  }
})
// register a new user
app.post('/register', async (req, res) => {
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
})

app.get('/register', async (req, res) => {
  // check if user is already logged in
  if (req.session.loggedin) {
    res.redirect('/')
  } else {
    res.render('register', { title: 'Register', layout: 'layouts/main' })
  }
})

// login a user
app.get('/login', async (req, res) => {
  await Kost.deleteMany({})
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
    res.json({ status: 'success', message: 'Login success' })
    // res.redirect('/')
  } else {
    res.json({ status: 'error', message: 'Incorrect email or password' })
  }
})

// handle when upload file
app.post('/upload', async (req, res) => {
  const { nama, alamat, phone } = req.body
  const { user } = req.session
  const { file } = req.files
  const fileName = file.name
  const fileExtension = fileName.split('.').pop()
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif']
  if (allowedExtensions.includes(fileExtension)) {
    const url = `uploads/images/${fileName}`
    file.mv(`public/uploads/images/${fileName}`, async (err) => {
      if (err) {
        res.json({ status: 'error', message: 'Failed to upload file' })
      } else {
        const kost = new Kost({
          name: nama,
          address: alamat,
          phone,
          photos: [{ url }],
        })
        try {
          await kost.save()
          res.render('uploadSuccess', {
            title: 'Upload Success',
            layout: 'layouts/main',
            user,
          })
        } catch (error) {
          res.status(400).json({ status: 'error', message: error })
        }
      }
    })
  } else {
    res.status(400).json({ status: 'error', message: 'Invalid file type' })
  }
})
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.status(200).json({ status: 'success', message: 'Logout success' })
  // res.redirect('/login')
})
app.get('/add', async (req, res) => {
  const { user } = req.session
  res.render('add', { title: 'Add', layout: 'layouts/main', user })
})
app.get('/:username', async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username })
  if (user) {
    res.render('profile', { title: 'Profile', layout: 'layouts/main', user })
  } else {
    next()
    // res.status(404).render('404', { title: '404', layout: 'layouts/main' })
  }
})
app.use((req, res) => {
  res.status(404).render('404', { title: '404', layout: 'layouts/main' })
})

// start the server
app.listen(port, () => {
  console.log(`indekost app listening at http://localhost:${port}`)
})
