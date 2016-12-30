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
import {Tracker} from 'meteor/tracker';
import roles from './roles-collection';
import Roles from './roles';


/**
 * Subscribes to role when user is modified (potentially his role)
 */
Roles.autoLoadUserRole = function () {
    Tracker.autorun(function () {
        let userId = (Meteor.user() || {})._id;
        if (userId) {
            Meteor.subscribe('userRole', userId);
        }
    });
};

/**
 * Returns the role of the current user
 * @return {*}
 */
Meteor.role = function () {
    let user = Meteor.user();
    return user ? roles.findOne({_id: user.roleId}) || null : null;
};

/**
 * Returns the role ID of the current user
 * @return {*}
 */
Meteor.roleId = function () {
    return (Meteor.role() || {})._id;
};
