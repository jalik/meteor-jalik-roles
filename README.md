# jalik:roles

This package gives you a fast and flexible way to control what users can do in a Meteor application.

### Installation

To install the package, execute this command in the root of your project :
```
meteor add jalik:roles
```

To remove the package :
```
meteor remove jalik:roles
```

### How it works

The package uses a Mongo.Collection accessible via **Meteor.roles**.
First thing, you need to create the roles you need on server side.

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

### Environment

All related methods are defined in the **Roles** object.
When a user logs in, his role is automatically subscribed on the client.

```js
if (Meteor.isClient) {
    // Get the current role id
    var roleId = Roles.roleId();
    // Get the current role object
    var role = Roles.role();
}
```

### Assigning roles

To assign a role to a user, there is the **Roles.setUserRole()** method.
By default, all operations are not allowed on the client, so you must use it on the server.

```js
if (Meteor.isServer) {
    Roles.setUserRole(adminId, roleId);
}
```

### Checking permissions

When roles are created and assigned, you can check if a user has one or more permissions using the **Roles.userCan()** method.

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
        displayCommentForm();
    }
    if (Roles.userCan(['edit','delete'], userId)) {
        displayActionButtons();
    }
}
```

### Helpers

If needed, you can use the available template helpers.

```html
{{#if userCan 'comment'}}
    {{> commentForm}}
{{/if}}
```