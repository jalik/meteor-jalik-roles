/*
 * Copyright (c) 2014.
 * The code of this file is the property of Karl STEIN.
 * You have no right to modify, share or sell this code.
 */

/**
 * The Roles collection
 * @type {Mongo.Collection}
 */
Meteor.roles = new Mongo.Collection('jalik-roles');


Roles = {
    /**
     * Checks if the role has a permission
     * @param actions
     * @param roleId
     * @return {boolean}
     */
    roleCan: function (actions, roleId) {
        if (typeof actions === 'string') {
            return Meteor.roles.find({_id: roleId, permissions: actions}).count() > 0;

        } else if (actions instanceof Array) {
            return Meteor.roles.find({_id: roleId, permissions: {$all: actions}}).count() > 0;
        }
        return false;
    },

    /**
     * Sets the user's role
     * @param userId
     * @param roleId
     */
    setUserRole: function (userId, roleId) {
        // Check if role exists
        if (roleId && Meteor.roles.find({_id: roleId}).count() < 1) {
            throw new Meteor.Error('role-not-found');
        }
        return Meteor.users.update(userId, {
            $set: {roleId: roleId}
        });
    },

    /**
     * Checks if the user has the permission
     * @param actions
     * @param userId
     * @return {boolean}
     */
    userCan: function (actions, userId) {
        // Check if actions is a string or array
        if (typeof actions === 'string') {
            actions = [actions];

        } else if (!(actions instanceof Array)) {
            throw new Meteor.Error('invalid-actions');
        }

        // Nothing to verify
        if (actions.length === 0) {
            return true;
        }

        var roleId;

        // Get role id
        if (Meteor.isClient) {
            roleId = Meteor.roleId();

        } else if (Meteor.isServer) {
            var user = Meteor.users.findOne(userId);
            roleId = user && user.roleId;
        }
        return this.roleCan(actions, roleId);
    }
};

if (Meteor.isClient) {
    /**
     * Returns the role of the current user
     * @return {any}
     */
    Meteor.role = function () {
        if (Meteor.userId()) {
            var user = Meteor.user();
            return user ? Meteor.roles.findOne(user.roleId) : null;
        }
        return null;
    };

    /**
     * Returns the role Id of the current user
     * @return {any}
     */
    Meteor.roleId = function () {
        var role = Meteor.role();
        return role && role._id;
    };

    /**
     * Subscribe to role when user log in
     */
    Meteor.startup(function () {
        Accounts.onLogin(function () {
            Meteor.subscribe('user-role');
        });
    });

    /**
     * Checks if the current user has the permission
     */
    Template.registerHelper('userCan', function (actions) {
        return Roles.userCan(actions);
    });
}

if (Meteor.isServer) {
    /**
     * Publish the role
     */
    Meteor.publish('role', function (roleId) {
        return Meteor.roles.find({_id: roleId});
    });

    /**
     * Publish the roles
     */
    Meteor.publish('roles', function () {
        return Meteor.roles.find();
    });

    /**
     * Publish the role of the current user
     */
    Meteor.publish('user-role', function () {
        // Get user
        var user = Meteor.users.findOne(this.userId, {
            fields: {roleId: 1}
        });

        if (user) {
            return [
                Meteor.roles.find({_id: user.roleId}),
                Meteor.users.find({_id: this.userId}, {
                    fields: {roleId: 1}
                })
            ];
        }
    });
}