/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home').as('home')

//! router
router
  .get('/movies/ok', async (ctx) => {
    return ctx.view.render('pages/movies', { movie: 'router-value 5' })
  })
  .as('movies.show')

//* More Example
// router.get('/movies', () => {}).as('movies.index')
// router.get('/movies/ok', () => {}).as('movies.show')
// router.get('/movies/create', () => {}).as('movies.create')
// router.post('/movies', () => {}).as('movies.store')
// router.get('/movies/ok/edit', () => {}).as('movies.edit')
// router.put('/movies/my-awesome-movie', () => {}).as('movies.update')
// router.delete('/movies/my-awesome-movie', () => {}).as('movies.destroy')
//* delete is a reserve word in js
