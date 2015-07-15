# jalik:roles

This package gives you a fast and flexible way to control what users can do in a Meteor application.

### Installation

To install the package, execute this command in the root of your project :
```
meteor add jalik:roles
```

If later you want to remove the package :
```
meteor remove jalik:roles
```

### Creating roles

First thing, you need to create the roles you need on the server.
For that you have a Mongo.Collection accessible via **Meteor.roles**.
By default, all operations (insert, update, remove) on this collection are not allowed on the client.

```js
if (Meteor.isServer) {
    if (Meteor.roles.find({}).count() === 0) {
        Meteor.roles.insert({
            name: 'Administrator',
            permissions: ['administrate']
        });
        Meteor.roles.insert({
            name: 'Member',
            permissions: ['vote','comment']
        });
    }
}
```

### Assigning roles

To assign a role, use the **Roles.setUserRole()** method on the server.

```js
if (Meteor.isServer) {
    // Set user's role
    Roles.setUserRole(adminId, roleId);
    // Remove user's role
    Roles.setUserRole(adminId, null);
}
```

### Getting the user's role

When a user logs in, his role is automatically subscribed on the client.
After that you can use the following methods to get the current role info.

```js
if (Meteor.isClient) {
    // Get the current role id
    var roleId = Meteor.roleId();
    // Get the current role object
    var role = Meteor.role();
}
```

### Checking permissions

You can check if a user has one or more permissions using the **Roles.userCan()** method, it will returns a boolean.

```js
if (Meteor.isClient) {
    if (Roles.userCan('comment')) {
        displayCommentForm();
    }
    if (Roles.userCan(['edit','delete'])) {
        displayActionButtons();
    }
}
if (Meteor.isServer) {
    if (Roles.userCan('comment', userId)) {
        console.log('user can comment');
    }
    if (Roles.userCan(['edit','delete'], userId)) {
        console.log('user can edit and delete');
    }
}
```

You can throw an error if the role or the user does not have the permissions.

```js
if (Meteor.isServer) {
    Roles.checkRolePerms('comment', roleId));
    Roles.checkUserPerms('edit', userId));
    // If the user cannot edit, the code below won't be executed
    console.log('user can edit');
}
```

### Helpers

```html
{{#if userCan 'comment'}}
    {{> commentForm}}
{{/if}}
```