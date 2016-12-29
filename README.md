# jalik:roles

This package gives you a fast and flexible way to control what users can do in a Meteor application.
You have full control over the permissions.

## Installation

To install the package, execute this command in the root of your project :
```
meteor add jalik:roles
```

If later you want to remove the package :
```
meteor remove jalik:roles
```

## Creating roles

First thing, you need to create the roles you need on the server.
For that you have a Mongo.Collection accessible via **Meteor.roles**.
By default, all operations (insert, update, remove) on this collection are not allowed on the client.

```js
import {Roles} from 'meteor/jalik:roles';

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

## Assigning role to a user

To assign a role, use the **Roles.setUserRole()** method on the server.

```js
if (Meteor.isServer) {
    let admin = Meteor.users.findOne({isAdmin: true});
    // Set user's role
    Roles.setUserRole(admin._id, roleId);
}
```

## Removing role from a user

```js
if (Meteor.isServer) {
    let admin = Meteor.users.findOne({isAdmin: true});
    // Remove user's role by setting null
    Roles.setUserRole(admin._id, null);
}
```

## Getting the user's role

When a user logs in, his role is automatically subscribed on the client.
After that you can use the following methods to get the current role info.

```js
if (Meteor.isClient) {
    // Get the current role ID
    let roleId = Meteor.roleId();
    // Get the current role object
    let role = Meteor.role();
}
if (Meteor.isServer) {
    // Get the role ID of this user
    let roleId = Roles.getUserRoleId(userId);
    // Get the role of this user
    let role = Roles.getUserRole(userId);
}
```

## Checking permissions

You can check if a user has one or more permissions using the **Roles.userCan()** method, it will returns a boolean.

```js
if (Meteor.isClient) {
    if (Roles.userCan('comment')) {
        // do stuff if the current user can comment
    }
    if (Roles.userCan('comment', Meteor.userId())) {
        // same as above
    }
    if (Roles.userCan(['edit','delete'])) {
        // do stuff if the current user has all this permissions
    }
}
if (Meteor.isServer) {
    if (Roles.userCan('comment', userId)) {
        // userId is required on server
    }
    if (Roles.userCan(['edit','delete'], userId)) {
        // do stuff if the user has all this permissions
    }
}
```

You can throw an error if the role or the user does not have the permissions.

```js
if (Meteor.isServer) {
    Roles.checkRolePerms('comment', roleId);
    Roles.checkUserPerms('edit', userId);
    // If the user cannot edit, the code below won't be executed
    console.log('user can edit');
}
```

## Publishing roles

You can create your own publications or use the package's default publications.

```js
// Expose the publications on the server
Roles.publish();
```

```js
// Subscribe to the publication you need on the client
Meteor.subscribe('role', roleId);
Meteor.subscribe('roles', {permissions: {$in: ['delete']}}, {sort: {name: 1}});
Meteor.subscribe('userRole');
```

## Adding template helpers

To add blaze template helpers, call the `Roles.addBlazeHelpers()` method.
This makes the following helpers available in your templates.

```html
{{#if userCan 'comment'}}
    {{> commentForm}}
{{/if}}
```

## Changelog

### v0.2.0
- Uses ES6 module export syntax
- Adds `Roles.roleExists(roleId)`
- Adds `Roles.publish()` on the server to publish roles explicitly
- Adds `Roles.addBlazeHelpers()` on to manually add a `userCan` template helper
- Removes automatic declaration of the `userCan` helper 
- Removes `templating` dependency to improve compatibility with non-blaze applications

## License

This project is released under the [MIT License](http://www.opensource.org/licenses/MIT).
