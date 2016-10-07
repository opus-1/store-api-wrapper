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
### Store Mixin
```javascript
      React.createClass({
        mixins: [Store.ReactMixin],
        followStores: function() {
          // Can be an array, object, or function that returns an array or object
          // Arrays can contain strings or objects
          // Strings will be both the state key and store key
          // Object keys will be the state key and values will be the store key
          // return ["users", { organization: "currentOrganization"]
          return {
            users: "users",
            assessments: "assessments"
          }
        },
        componentDidMount: function() {
          this.followChange(Store("users.params").onChange(function() {
            // Follow more changes
          }))
        }
      })
      // All the stores or changes that are followed, will be detached in componentDidUnmount
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
