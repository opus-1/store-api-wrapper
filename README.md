Store Api Wrapper (Model)
## Models
```javascript
  User = Model({
    api: Client("/api/users"),
    store: Store("users")
  })
```


## Stores
### Store Instance
```javascript 
  users = Store("users");
```

### Get
```javascript
  users.get()
```
### Listen for changes
```javascript
  users.onChange(function(){
    console.log(users.get())
  })
```

### Set
```javascript
  users.set({email: "johndoe@example.com"});
```

### Sub Stores
``` javascript
  userId = 1
  users.store(userId).store("profiles").set([{
    firstName: "John", 
    lastName: "Doe"
  }]);
```

### Special Listerners
``` javascript
  users.onIsEqualTo({email: "billdoe@example.com"}, function(){
    console.log("Is now Bill Doe's email")
  });

  users.set({email: "billdoe@example.com"})
```
### All Other Listeners
    update
    change
    empty
    blank
    create
    notBlank
    isObject
    isArray
    isString
    isNumber
    increase
    decrease


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