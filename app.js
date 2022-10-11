import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import fileUpload from 'express-fileupload'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import './utils/database/db.js'
import { User } from './utils/database/models.js'
import router from './routes/index.js'

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
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.setHeader('Pragma', 'no-cache');
  next();
});

// // render the index page

app.get('/', router.Home)
app.post('/register', router.registerSubmit)
app.get('/register', router.renderRegisterPage)
app.get('/login', router.renderLoginPage)
app.post('/login', router.loginSubmit)
app.post('/upload', router.Post)
app.get('/add', router.Add)
app.get('/detail/:kostName', router.detailsKost)
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.status(200).json({ status: 'success', message: 'Logout success' })
})
app.get('/:username', router.Profile)
app.use((_req, res) => {
  res.status(404).render('404', { title: '404', layout: 'layouts/main' })
})

// start the server
app.listen(port, () => {
  console.log(`indekost app listening at http://localhost:${port}`)
})
