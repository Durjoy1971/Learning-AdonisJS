# <span style="color:teal">Services</span>

Suppose you need to fetch user data and perform some transformations on it. Instead of writing this logic in multiple controllers, you can create a `MovieService` with some static methods like `getSlugUrl(), getSlugs, read()`.

```typescript
// services/MovieService.ts
import app from '@adonisjs/core/services/app'
import { readdir, readFile } from 'node:fs/promises'
import { MarkdownFile } from '@dimerapp/markdown'
import { Exception } from '@adonisjs/core/exceptions'

export default class MovieService {
    static getSlugUrl(slug: string) {
        if (!slug.endsWith('.md')) {
            slug += '.md'
        }
        return app.makeURL(`resources/movies/${slug}`)
    }
    static async getSlugs() {
        const files = await readdir(app.makeURL('resources/movies'))
        return files.map((file) => file.replace('.md', ''))
    }
    static async read(slug: string) {
        try {
            const url = this.getSlugUrl(slug)
            const file = await readFile(url, 'utf8')
            const md = new MarkdownFile(file)

            await md.process()

            return md
        } catch (error) {
            throw new Exception('Could not find a movie called ' + `${slug}`, {
                code: 'E_NOT_FOUND',
                status: 404,
            })
        }
    }
}
```

### <span style="color:brown">Using the Service in a Controller</span>

```typescript
// app/controllers/movies_controller.ts
import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'
import { toHtml } from '@dimerapp/markdown/utils'

export default class MoviesController {
    async index({ view }: HttpContext) {
        const slugs = await MovieService.getSlugs()
        const movies: Record<string, any>[] = []

        for (const slug of slugs) {
            const md = await MovieService.read(slug)

            movies.push({
                title: md.frontmatter.Title,
                slug,
            })
        }

        return view.render('pages/home', { movies })
    }

    async show({ view, params }: HttpContext) {
        const md = await MovieService.read(params.slug)
        const movie = toHtml(md).contents
        view.share({ movie, md })
        return view.render('pages/movies/show')
    }
}
```

### <span style="color:brown">Things We Got From Services</span>
---
- **Services** encapsulate reusable logic to keep controllers clean.
- **Creating services** involves defining a class and using it in controllers.
- **Benefits** include better code organization, easier testing, and maintaining separation of concerns.

---
# <span style="color:teal">Controller Basics</span>
Controllers are responsible for handling incoming requests and returning responses to the client. They typically interact with services to perform business logic and return the result.

```typescript
// app/controllers/movies_controller.ts
import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'
import { toHtml } from '@dimerapp/markdown/utils'

export default class MoviesController {
    async index({ view }: HttpContext) {
        const slugs = await MovieService.getSlugs()
        const movies: Record<string, any>[] = []

        for (const slug of slugs) {
            const md = await MovieService.read(slug)

            movies.push({
                title: md.frontmatter.Title,
                slug,
            })
        }

        return view.render('pages/home', { movies })
    }

    async show({ view, params }: HttpContext) {
        const md = await MovieService.read(params.slug)
        const movie = toHtml(md).contents
        view.share({ movie, md })
        return view.render('pages/movies/show')
    }
}
```

### <span style="color:brown">Routes with Controllers</span>

Routes define the endpoints of your application and map them to controller actions. This allows you to handle different HTTP requests and direct them to the appropriate controller methods.

```typescript
// start/routes.ts
import router from '@adonisjs/core/services/router'
const MoviesController = () => import('#controllers/movies_controller')

router.get('/', [MoviesController, 'index']).as('home')
router
    .get('/movies/:slug', [MoviesController, 'show'])
    .as('movies.show')
    .where('slug', router.matchers.slug())
```

By defining routes, you can ensure that incoming requests are handled by the correct controller actions, promoting a clean and organized codebase.

### <span style="color:brown">Defining a Model</span>

Models in AdonisJS represent the data structure of your application and provide an interface for interacting with the database. They are typically used to perform CRUD operations.

```typescript
import MovieService from '#services/movie_service'
import { toHtml } from '@dimerapp/markdown/utils'

export default class Movie {
    declare title: string
    declare slug: string
    declare abstract: string

    static async all() {
        const slugs = await MovieService.getSlugs()
        const movies: Movie[] = []

        for (const slug of slugs) {
            const movie = await this.find(slug)
            movies.push(movie)
        }

        return movies
    }

    static async find(slug: string) {
        const md = await MovieService.read(slug)
        const movie = new Movie()

        movie.abstract = toHtml(md).contents
        movie.slug = slug
        movie.title = md.frontmatter.Title

        return movie
    }
}
```

/**
 * The Movie class represents a movie with a title, slug, and abstract.
 * It provides methods to fetch all movies or find a specific movie by its slug.
 */