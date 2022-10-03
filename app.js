const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

// use ejs as the view engine
app.set('view engine', 'ejs');

// use express layouts 
app.use(expressLayouts);

// render the index page

app.get('/', (req, res) => {
  res.render('index', { title: 'Home', layout: 'layouts/main' });
});

// get with dinaamic route
app.get('/details/:id', (req, res) => {
  const id = req.params.id
  if (id) {
    res.render('details', {id});
  } else {
    res.render('index');
  }
});

// start the server
app.listen(port, () => {
  console.log(`indekost app listening at http://localhost:${port}`);
});
