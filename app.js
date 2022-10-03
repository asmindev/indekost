const express = require('express');
const app = express();
const port = 3000;

// use ejs as the view engine
app.set('view engine', 'ejs');

// render the index page

app.get('/', (req, res) => {
  res.render('index');
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
  console.log(`Indekost app listening at http://localhost:${port}`);
});
