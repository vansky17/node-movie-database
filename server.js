require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const MOVIEDEX = require('./moviedex.json');

app.use(morgan('dev'));
app.use(cors());

//handle authorization
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.headers.authorization
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    console.log(apiToken);
    console.log('User sends token: '+authToken);
    next()
  })
  app.get('/', (req, res) => {
    res.json(MOVIEDEX);
});
// Get movie by genre / country / vote
function handleGetMovie(req, res) {
  let response = MOVIEDEX;
  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }
  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }
  if (req.query.avg_vote) {
    response = response.filter(movie =>
      Number.parseInt(movie.avg_vote) >= Number.parseInt(req.query.avg_vote)
    )
  }
  res.json(response);
}
  
app.get('/movie', handleGetMovie);

const PORT= 8000;

app.listen(PORT, () => {
  console.log('Server is listening on port 8000');
})

