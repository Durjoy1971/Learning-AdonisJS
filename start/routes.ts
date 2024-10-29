/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { Exception } from '@adonisjs/core/exceptions'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'
import fs from 'node:fs/promises'
import { MarkdownFile } from '@dimerapp/markdown'
import { toHtml } from '@dimerapp/markdown/utils'

router
  .get('/', async (ctx) => {
    const url = app.makeURL('resources/movies')
    const files = await fs.readdir(url)
    console.log(files)
    const movies: Record<string, any>[] = []

    for (const filename of files) {
      const movieURL = app.makeURL(`resources/movies/${filename}`)
      const file = await fs.readFile(movieURL, 'utf8')
      const md = new MarkdownFile(file)
      await md.process()

      movies.push({
        title: md.frontmatter.Title,
        slug: filename.replace('.md', ''),
      })
    }

    console.log(movies)

    return ctx.view.render('pages/home', { movies })
  })
  .as('home')

//* Reading and Supporting Markdown
router
  .get('/movies/:slug', async (ctx) => {
    const url = app.makeURL(`resources/movies/${ctx.params.slug}.md`)

    try {
      const file = await fs.readFile(url, 'utf-8')
      const md = new MarkdownFile(file)
      await md.process()
      const movie = toHtml(md).contents

      ctx.view.share({ movie })
    } catch (error) {
      throw new Exception('Could not find a movie called ' + `${ctx.params.slug}`, {
        code: 'E_NOT_FOUND',
        status: 404,
      })
    }
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
