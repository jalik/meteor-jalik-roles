/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {Meteor} from 'meteor/meteor';
import roles from './roles-collection';


export const Roles = {
    /**
     * Adds a "userCan" helper for Blaze
     */
    addBlazeHelpers() {
        // Checks if the current user has the permission
        Template.registerHelper('userCan', function (permissions) {
            return Roles.userCan(permissions);
        });
    },

    /**
     * Adds one or more permissions to a role
     * @param permission
     * @param roleId
     * @returns {*}
     */
    addRolePerms(permission, roleId) {
        if (typeof permission === 'string') {
            permission = [permission];
        }
        else if (!(permission instanceof Array)) {
            throw new TypeError("action must be a string or an array of strings");
        }
        return roles.update({_id: roleId}, {$addToSet: {permissions: {$each: permission}}});
    },

    /**
     * Throws an error if the role does not have the permissions
     * @param permission
     * @param roleId
     */
    checkRolePerms(permission, roleId) {
        if (!this.roleCan(permission, roleId)) {
            throw new Meteor.Error('forbidden', "Action is forbidden");
        }
    },

    /**
     * Throws an error if the user does not have the permissions
     * @param permission
     * @param userId
     */
    checkUserPerms(permission, userId) {
        if (!this.userCan(permission, userId)) {
            throw new Meteor.Error('forbidden', "Action is forbidden");
        }
    },

    /**
     * Returns the role's permissions
     * @param roleId
     * @returns {Array}
     */
    getRolePerms(roleId) {
        return (roles.findOne({_id: roleId}, {fields: {permissions: 1}}) || {permissions: []}).permissions;
    },

    /**
     * Returns the role of the user
     * @param userId
     */
    getUserRole(userId) {
        let user = Meteor.users.findOne({_id: userId}, {fields: {roleId: 1}});
        return user ? roles.findOne({_id: user.roleId}) : null;
    },

    /**
     * Returns the ID of the user role
     * @param userId
     */
    getUserRoleId(userId) {
        let user = Meteor.users.findOne({_id: userId}, {fields: {roleId: 1}});
        return user ? user.roleId : null;
    },

    /**
     * Removes one or more permissions from a role
     * @param permission
     * @param roleId
     * @returns {*}
     */
    removeRolePerms(permission, roleId) {
        if (typeof permission === 'string') {
            permission = [permission];
        }
        else if (!(permission instanceof Array)) {
            throw new TypeError("action must be a string or an array of strings");
        }
        return roles.update({_id: roleId}, {$pull: {permissions: {$in: permission}}});
    },

    /**
     * Checks if the role has one or more permissions
     * @param permission
     * @param roleId
     * @return {boolean}
     */
    roleCan(permission, roleId) {
        if (typeof permission === 'string') {
            return roles.find({_id: roleId, permissions: permission}).count() > 0;
        }
        else if (permission instanceof Array) {
            return roles.find({_id: roleId, permissions: {$all: permission}}).count() > 0;
        }
        return false;
    },

    /**
     * Checks if the role exists
     * @param roleId
     * @returns {boolean}
     */
    roleExists(roleId) {
        return roles.find({_id: roleId}).count() === 1;
    },

    /**
     * Sets the permissions of a role
     * @param permissions
     * @param roleId
     * @returns {*}
     */
    setRolePerms(permissions, roleId) {
        if (!(permissions instanceof Array)) {
            throw new TypeError("permissions must be an array of strings");
        }
        return roles.update({_id: roleId}, {$set: {permissions: permissions}});
    },

    /**
     * Sets the user role
     * @param userId
     * @param roleId
     */
    setUserRole(userId, roleId) {
        if (typeof roleId !== 'string') {
            roleId = null;
        }
        // Check if role exists
        if (roleId && !this.roleExists(roleId)) {
            throw new Meteor.Error('role-not-found', "Role does not exist");
        }
        return Meteor.users.update({_id: userId}, {$set: {roleId: roleId}});
    },

    /**
     * Checks if the user has one or more permissions
     * @param permission
     * @param userId
     * @return {boolean}
     */
    userCan(permission, userId) {
        let roleId;

        if (typeof permission === 'string') {
            permission = [permission];
        }
        else if (!(permission instanceof Array)) {
            throw new TypeError("action must be a string or an array of strings");
        }
        // Nothing to verify
        if (permission.length === 0) {
            return true;
        }
        // Get user role
        if (Meteor.isClient) {
            if (typeof userId === 'string') {
                roleId = this.getUserRoleId(userId);
            } else {
                roleId = Meteor.roleId();
            }
        }
        else if (Meteor.isServer) {
            roleId = this.getUserRoleId(userId);
        }
        return this.roleCan(permission, roleId);
    }
};

export default Roles;

// Expose role collection in Meteor's global namespace
Meteor.roles = roles;

if (Meteor.isServer) {
    require('./roles-server');

    // Expose the module globally
    if (typeof global !== 'undefined') {
        global.Roles = Roles;
    }
}
else if (Meteor.isClient) {
    require('./roles-client');

    // Expose the module globally
    if (typeof window !== 'undefined') {
        window.Roles = Roles;
    }
}
