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

var roleId;

if (Meteor.isServer) {
    Tinytest.add('create role', function (test) {
        roleId = Meteor.roles.insert({name: "Test", permissions: ['test']});
        test.equal(Meteor.roles.find({_id: roleId}).count(), 1);
        Meteor.roles.remove(roleId);
    });

    Tinytest.add('check role permission', function (test) {
        roleId = Meteor.roles.insert({name: "Test", permissions: ['test']});
        test.equal(Roles.roleCan('test', roleId), true);
        Meteor.roles.remove(roleId);
    });

}

if (Meteor.isClient) {
    Tinytest.addAsync('create role denied', function (test, done) {
        Meteor.roles.insert({name: "Test", permissions: ['test']});
        Meteor.setTimeout(function () {
            test.equal(Meteor.roles.find({name: 'Test'}).count(), 0);
            done();
        }, 500);
    });
}
