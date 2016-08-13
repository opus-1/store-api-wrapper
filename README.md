# store-api-wrapper
```javascript
  User = Model({
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
  ApiClient.users.findOne({id: 10}).then(function(user){
    console.log(user)
  })
```