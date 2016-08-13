# store-api-wrapper

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