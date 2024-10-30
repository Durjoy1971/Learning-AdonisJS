# <span style="color:teal">Services</span>

Suppose you need to fetch user data and perform some transformations on it. Instead of writing this logic in multiple controllers, you can create a `UserService` with a method like `getUserData(userId)`.

```javascript
// services/UserService.js
class UserService {
    async getUserData(userId) {
        // Logic to fetch and transform user data
        const user = await User.find(userId);
        // ... more logic
        return user;
    }
}

module.exports = new UserService();
```

### <span style="color:brown">Using the Service in a Controller</span>
# 
```javascript
// controllers/UserController.js
const UserService = require('../services/UserService');

class UserController {
    async show({ params, response }) {
        const userData = await UserService.getUserData(params.id);
        return response.json(userData);
    }
}

module.exports = UserController;
```

### <span style="color:brown">Things We Got From Services</span>
---
- **Services** encapsulate reusable logic to keep controllers clean.
- **Creating services** involves defining a class and using it in controllers.
- **Benefits** include better code organization, easier testing, and maintaining separation of concerns.

---
# <span style="color:teal">Controller Basics</span>
Controllers are responsible for handling incoming requests and returning responses to the client. They typically interact with services to perform business logic and return the result.

```javascript
// controllers/UserController.js
class UserController {
    async show({ params, response }) {
        // Interact with the service to get user data
        const userData = await UserService.getUserData(params.id);
        return response.json(userData);
    }
}

module.exports = UserController;
```

### <span style="color:brown">Routes with Controllers</span>

Routes define the endpoints of your application and map them to controller actions. This allows you to handle different HTTP requests and direct them to the appropriate controller methods.

```javascript
// start/routes.js
const Route = use('Route');
const UserController = require('../app/Controllers/Http/UserController');

Route.get('/users/:id', 'UserController.show');
```

By defining routes, you can ensure that incoming requests are handled by the correct controller actions, promoting a clean and organized codebase.