# jalik:roles

This package adds a simple and flexible permissions system that allows you to control what users can do or cannot do in your Meteor apps.
The code is well tested with the mocha testing framework.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SS78MUMW8AH4N)

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

You first need to define the roles of your app.
A role can be assigned to one or more users, but a user can only have one role.

Create the default roles when the app starts.
The roles collection is accessible via `Meteor.roles` which is a `Mongo.Collection` object.

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

if (Meteor.isServer) {
    if (Meteor.roles.find({}).count() === 0) {
        // Define administrator role
        Meteor.roles.insert({
            name: "Administrator",
            permissions: ['administrate']
        });
        // Define member role
        Meteor.roles.insert({
            name: "Member",
            permissions: ['vote', 'comment']
        });
    }
}
```

Note that by default, all operations (insert, update, remove) on the roles collection are not allowed on the client.
If you want to interact with the collection, create your own `Meteor.methods` or set permissions with `Meteor.roles.allow()` or `Meteor.roles.deny()`.

## Adding permissions to a role

To add one or more permissions to a role, use `Roles.addRolePerms(permission, roleId)`.

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

if (Meteor.isServer) {
    let role = Meteor.roles.findOne({name: "Administrator"});
    Roles.addRolePerms('administrate', role._id);
    Roles.addRolePerms(['create', 'delete'], role._id);
}
```

## Removing permissions from a role

To remove one or more permissions from a role, use `Roles.removeRolePerms(permission, roleId)`.

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

if (Meteor.isServer) {
    let role = Meteor.roles.findOne({name: "Administrator"});
    Roles.removeRolePerms('administrate', role._id);
    Roles.removeRolePerms(['create', 'delete'], role._id);
}
```

## Getting permissions of a role

To get all permissions of a role, use `Roles.getRolePerms(roleId)`.

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

if (Meteor.isServer) {
    let role = Meteor.roles.findOne({name: "Administrator"});
    let perms = Roles.getRolePerms(role._id);
    console.log(perms);
}
```

## Assigning a role to a user

To assign a role, use the `Roles.setUserRole(userId, roleId)` method.
The role will be stored on the user object, in the `roleId` attribute.

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

if (Meteor.isServer) {
    let user = Meteor.users.findOne({name: "karl"});
    let role = Meteor.roles.findOne({name: "Administrator"});
    // Set user's role
    Roles.setUserRole(user._id, role._id);
}
```

## Removing a role from a user

To remove a role from a user, use the `Roles.setUserRole(userId, null)` method.

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

if (Meteor.isServer) {
    let user = Meteor.users.findOne({name: "karl"});
    // Remove user's role by setting null
    Roles.setUserRole(user._id, null);
}
```

## Getting the role of a user

To get the role of a user, call the `Roles.getUserRole(userId)` or `Roles.getUserRoleId(userId)`.
On the client, there you can use `Meteor.role()` or `Meteor.roleId()`.

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

if (Meteor.isClient) {
    // Get the current role ID
    let roleId = Meteor.roleId();
    // Get the current role object
    let role = Meteor.role();
}
if (Meteor.isServer) {
    let user = Meteor.users.findOne({name: "karl"});
    // Get the role ID of this user
    let roleId = Roles.getUserRoleId(user._id);
    // Get the role of this user
    let role = Roles.getUserRole(user._id);
}
```

NOTE : on the client, you should make sure that roles are loaded via subscriptions.

## Checking permissions

To check if a user has one or more permissions, use `Roles.userCan(permission, userId)`.
You can do the same with a role using the `Roles.roleCan(permission, userId)`.

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

if (Meteor.isClient) {
    // do stuff if the current user can comment
    if (Roles.userCan('comment')) {
    }
    // equivalent to above
    if (Roles.userCan('comment', Meteor.userId())) {
    }
    // do stuff if the current user has all this permissions, not only one
    if (Roles.userCan(['edit', 'delete'])) {
    }
}
if (Meteor.isServer) {
    let user = Meteor.users.findOne({name: "karl"});
    let role = Meteor.roles.findOne({name: "Member"});
    
    // userId is required on server
    if (Roles.userCan('comment', user._id)) {
    }
    // do stuff if the user has all this permissions
    if (Roles.userCan(['edit', 'delete'], user._id)) {
    }
    // do stuff if the role can comment
    if (Roles.roleCan('comment', role._id)) {
    }
}
```

You can throw an error if the role or the user does not have the permissions.

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

let user = Meteor.users.findOne({name: "karl"});
let role = Meteor.roles.findOne({name: "Member"});

// Throw a 'forbidden' error if the checks fail
Roles.checkUserPerms('send_comment', user._id);
Roles.checkRolePerms('comment', role._id);

// If the user cannot edit, the code below won't be reached
console.log('sending comment...');
```

## Publishing roles

Do not forget to publish/subscribe to the roles collection to make them accessible on clients.
You can create your own publications or use the package's default publications.

```js
import {Roles} from 'meteor/jalik:roles';

// Creates the 'role' publication
Roles.publishRole();
// Creates the 'roles' publication
Roles.publishRoles();
// Creates the 'userRole' publication
// This one is important if you want to auto-subscribe to the current user's role
// It can be used in combination of the Roles.autoLoadUserRole() method
Roles.publishUserRole();
```

```js
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';

// Subscribe to the publication you need on the client
Meteor.startup(function() {
    // Load a single role
    Meteor.subscribe('role', roleId);
    // Load all roles with the "delete" permission
    Meteor.subscribe('roles', {permissions: {$in: ['delete']}}, {sort: {name: 1}});
    // Load the role of the current user (manually)
    Meteor.subscribe('userRole');
    // Automatically subscribe to the role of the current user
    // re-subscribe if user change or if role change.
    Roles.autoLoadUserRole();
});
```

## Adding template helpers

To add blaze template helpers, call the `Roles.addBlazeHelpers()` method, which will execute the code below :

```js
Template.registerHelper('userCan', function (permissions) {
    return Roles.userCan(permissions);
});
```

After what the following helper will be available in your templates.

```html
{{#if userCan 'comment'}}
    {{> commentForm}}
{{/if}}
```

## Changelog

### v0.2.1
- Fixes `this` scope in `Roles.addBlazeHelpers()`

### v0.2.0
- Uses ES6 module `import` and `export` syntax
- Adds `Roles.addBlazeHelpers()` to manually add a `userCan` template helper
- Adds `Roles.addRolePerms(permission, roleId)` to add permission to a role
- Adds `Roles.autoLoadUserRole()` to load user's role automatically on the client
- Adds `Roles.getRolePerms(roleId)` to get the permissions of a role
- Adds `Roles.getUserRoleId(userId)` to get the role ID of a user
- Adds `Roles.publishRole()` on the server to publish a single role
- Adds `Roles.publishRoles()` on the server to publish the roles collection
- Adds `Roles.publishUserRole()` on the server to publish the current user's role
- Adds `Roles.removeRolePerms(permission, roleId)` to remove permission from a role
- Adds `Roles.roleExists(roleId)` to check if a role exists
- Adds `Roles.setRolePerms(permissions, roleId)` to replace permissions of a role
- Adds unit tests to eliminate bugs
- Removes automatic declaration of the `userCan` template helper
- Removes `templating` dependency to improve compatibility with non-blaze applications
- Modifies `Roles.getUserRole(userId)` to return the role object instead of the role ID

## License

This project is released under the [MIT License](http://www.opensource.org/licenses/MIT).
