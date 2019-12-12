require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const MOVIEDEX = require('./moviedex.json');

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(cors());

//handle authorization
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.headers.authorization
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
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
// 4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
})

