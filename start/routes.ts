/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { toHtml } from '@dimerapp/markdown/utils'
import MovieService from '#services/movie_service'

router
  .get('/', async (ctx) => {
    const slugs = await MovieService.getSlugs()
    const movies: Record<string, any>[] = []

    for (const slug of slugs) {
      const md = await MovieService.read(slug)

      movies.push({
        title: md.frontmatter.Title,
        slug,
      })
    }

    return ctx.view.render('pages/home', { movies })
  })
  .as('home')

//* Reading and Supporting Markdown
router
  .get('/movies/:slug', async (ctx) => {
    const md = await MovieService.read(ctx.params.slug)
    const movie = toHtml(md).contents
    ctx.view.share({ movie, md })
    return ctx.view.render('pages/movies/show')
  })
  .as('movies.show')
  .where('slug', router.matchers.slug())

//* Validate Route Parameters -> :slug
// router
//   .get('/movies/:slug', async (ctx) => {
//     const url = app.makeURL(`resources/movies/${ctx.params.slug}.html`)
//     let movie: any

//     try {
//       movie = await fs.readFile(url, 'utf-8')
//       ctx.view.share({ movie })
//     } catch (error) {
//       throw new Exception('Could not find a move called ' + `${ctx.params.slug}`, {
//         code: 'E_NOT_FOUND',
//         status: 404,
//       })
//     }
//     return ctx.view.render('pages/movies/show')
//   })
//   .as('movies.show')
//   .where('slug', router.matchers.slug())

//* Using Route Parameters -> :slug
// router
//   .get('/movies/:slug', async (ctx) => {
//     const url = app.makeURL(`resources/movies/${ctx.params.slug}.html`)
//     const movie = await fs.readFile(url, 'utf-8')
//     return ctx.view.render('pages/movies/show', { movie })
//   })
//   .as('movies.show')

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
