/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import fs from 'node:fs/promises'

router.on('/').render('pages/home').as('home')

//* Using Route Parameters -> :slug
router
  .get('/movies/:slug', async (ctx) => {
    const url = app.makeURL(`resources/movies/${ctx.params.slug}.html`)
    const movie = await fs.readFile(url, 'utf-8')
    return ctx.view.render('pages/movies/show', { movie })
  })
  .as('movies.show')

//? router with default way
// router
//   .get('/movies/ok', async (ctx) => {
//     return ctx.view.render('pages/movies', { movie: 'router-value 5' })
//   })
//   .as('movies.show')

//* More Example
// router.get('/movies', () => {}).as('movies.index')
// router.get('/movies/ok', () => {}).as('movies.show')
// router.get('/movies/create', () => {}).as('movies.create')
// router.post('/movies', () => {}).as('movies.store')
// router.get('/movies/ok/edit', () => {}).as('movies.edit')
// router.put('/movies/my-awesome-movie', () => {}).as('movies.update')
// router.delete('/movies/my-awesome-movie', () => {}).as('movies.destroy')
//* delete is a reserve word in js
