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

import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';
import {Roles} from './roles';
import roles from './roles-collection';


/**
 * Exposes default role publications
 */
Roles.publish = function () {
    // Publish a single role
    Meteor.publish('role', function (roleId) {
        check(roleId, String);
        return roles.find({_id: roleId});
    });
    // Publish a list of roles
    Meteor.publish('roles', function (filters, options) {
        return roles.find(filters, options);
    });
    // Publish the role of the current user
    Meteor.publish('userRole', function () {
        if (!this.userId) {
            return this.ready();
        }
        let roleId = Roles.getUserRoleId(this.userId);

        if (roleId) {
            return [
                roles.find({_id: roleId}),
                Meteor.users.find({_id: this.userId}, {fields: {roleId: 1}})
            ];
        } else {
            return this.ready();
        }
    });
};
