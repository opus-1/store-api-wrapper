# store-api-wrapper
```javascript
  User = Saw({
    api: {
      create: ApiClient.createUser,
      update: ApiClient.updateUser,
      find: ApiClient.getUser,
      remove: ApiClient.removeUser
    },
    store: localStorage,
    socket: "ActionCable"
  })
```

## Client
```javascript
  ApiClient = {
    users: Client("/api/users"),
    organizations: Client({"/api/organizations", scope: "find"})
  }
```