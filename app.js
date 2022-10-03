const express = require('express');
const app = express();
const port = 3000;

// use ejs as the view engine
app.set('view engine', 'ejs');

// render the index page

app.get('/', (req, res) => {
  console.log('rendering index page');
  res.render('index');
});

// start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}
