# Services

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

## Using the Service in a Controller

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

## Things We Got From Services

- **Services** encapsulate reusable logic to keep controllers clean.
- **Creating services** involves defining a class and using it in controllers.
- **Benefits** include better code organization, easier testing, and maintaining separation of concerns.