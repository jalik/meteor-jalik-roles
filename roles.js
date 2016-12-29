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
     * Adds a "userCan" template helper
     */
    addBlazeHelpers() {
        // Checks if the current user has the permission
        Template.registerHelper('userCan', function (perms) {
            return this.userCan(perms);
        });
    },

    /**
     * Throws an error if the role does not have the permissions
     * @param action
     * @param roleId
     */
    checkRolePerms(action, roleId) {
        if (!this.roleCan(action, roleId)) {
            throw new Meteor.Error('forbidden', "Action is forbidden");
        }
    },

    /**
     * Throws an error if the user does not have the permissions
     * @param action
     * @param userId
     */
    checkUserPerms(action, userId) {
        if (!this.userCan(action, userId)) {
            throw new Meteor.Error('forbidden', "Action is forbidden");
        }
    },

    /**
     * Returns the user's role
     * @param userId
     */
    getUserRole(userId) {
        let user = Meteor.users.findOne({_id: userId}, {fields: {roleId: 1}});
        return user ? roles.findOne({_id: user.roleId}) : null;
    },

    /**
     * Returns the user's role ID
     * @param userId
     */
    getUserRoleId(userId) {
        let user = Meteor.users.findOne({_id: userId}, {fields: {roleId: 1}});
        return user ? user.roleId : null;
    },

    /**
     * Checks if the role has a permission
     * @param action
     * @param roleId
     * @return {boolean}
     */
    roleCan(action, roleId) {
        if (typeof action === 'string') {
            return roles.find({_id: roleId, permissions: action}).count() > 0;
        }
        else if (action instanceof Array) {
            return roles.find({_id: roleId, permissions: {$all: action}}).count() > 0;
        }
        return false;
    },

    /**
     * Checks if the role exists
     * @param roleId
     * @returns {boolean}
     */
    roleExists(roleId){
        return roles.find({_id: roleId}).count() === 1;
    },

    /**
     * Sets the user role
     * @param userId
     * @param roleId
     */
    setUserRole(userId, roleId) {
        // Check if role exists
        if (!roleId || !this.roleExists(roleId)) {
            throw new Meteor.Error('role-not-found', "Role does not exist");
        }
        return Meteor.users.update({_id: userId}, {$set: {roleId: roleId}});
    },

    /**
     * Checks if the user has the permission
     * @param action
     * @param userId
     * @return {boolean}
     */
    userCan(action, userId) {
        let roleId;

        // Check if actions is a string or array
        if (typeof action === 'string') {
            action = [action];
        }
        else if (!(action instanceof Array)) {
            throw new TypeError("Permissions must be an Array of String or a String");
        }
        // Nothing to verify
        if (action.length === 0) {
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
        return this.roleCan(action, roleId);
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
