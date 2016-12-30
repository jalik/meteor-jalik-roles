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

// import {Accounts} from 'meteor/accounts-base'
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/jalik:roles';
import {chai} from 'meteor/practicalmeteor:chai';

describe('Roles', function () {

    let roleId;
    let userId;

    before(function () {
        if (Meteor.isServer) {
            Meteor.roles.remove({});
            // Meteor.users.remove({});

            // Add publications
            Roles.publishRole();
            Roles.publishRoles();
            Roles.publishUserRole();

            // todo Create test user
            // userId = Accounts.createUser({
            //     email: 'test@mail.com',
            //     password: 'test',
            //     profile: {name: 'test'}
            // });
        }
    });

    /**
     * Server tests
     */
    if (Meteor.isServer) {

        describe(`Meteor.roles.insert({name: "Tester", permissions: ['test']})`, function () {
            it(`should create the 'Tester' role`, function () {
                roleId = Meteor.roles.insert({name: "Tester", permissions: ['test']});
                chai.assert.equal(Meteor.roles.find(roleId).count(), 1);
            });
        });

        /**
         * Roles.roleExists
         */

        describe(`Roles.roleExists(roleId)`, function () {
            it(`should return true`, function () {
                chai.assert.equal(Roles.roleExists(roleId), true);
            });
        });

        describe(`Roles.roleExists(null)`, function () {
            it(`should return false`, function () {
                chai.assert.equal(Roles.roleExists(null), false);
            });
        });

        /**
         * Roles.roleCan
         */

        describe(`Roles.roleCan('test', roleId)`, function () {
            it(`should return true`, function () {
                chai.assert.equal(Roles.roleCan('test', roleId), true);
            });
        });

        describe(`Roles.roleCan(['test'], roleId)`, function () {
            it(`should return true`, function () {
                chai.assert.equal(Roles.roleCan(['test'], roleId), true);
            });
        });

        describe(`Roles.roleCan(null, roleId)`, function () {
            it(`should return false`, function () {
                chai.assert.equal(Roles.roleCan(null, roleId), false);
            });
        });

        describe(`Roles.roleCan('', roleId)`, function () {
            it(`should return false`, function () {
                chai.assert.equal(Roles.roleCan('', roleId), false);
            });
        });

        describe(`Roles.roleCan([], roleId)`, function () {
            it(`should return false`, function () {
                chai.assert.equal(Roles.roleCan([], roleId), false);
            });
        });

        describe(`Roles.roleCan([''], roleId)`, function () {
            it(`should return false`, function () {
                chai.assert.equal(Roles.roleCan([''], roleId), false);
            });
        });

        /**
         * Roles.addRolePerms
         */

        describe(`Roles.addRolePerms('create', roleId)`, function () {
            it(`should add the 'create' permission`, function () {
                Roles.addRolePerms('create', roleId);
                chai.assert.equal(Roles.roleCan('create', roleId), true);
            });
        });

        describe(`Roles.addRolePerms(['delete', 'update'], roleId) `, function () {
            it(`should add the 'delete' and 'update' permissions`, function () {
                Roles.addRolePerms(['delete', 'update'], roleId);
                chai.assert.equal(Roles.roleCan('delete', roleId), true);
                chai.assert.equal(Roles.roleCan('update', roleId), true);
            });
        });

        /**
         * Roles.removeRolePerms
         */

        describe(`Roles.removeRolePerms('create', roleId)`, function () {
            it(`should remove the 'create' permission`, function () {
                Roles.removeRolePerms('create', roleId);
                chai.assert.equal(Roles.roleCan('create', roleId), false);
            });
        });

        describe(`Roles.removeRolePerms(['delete', 'update'], roleId) `, function () {
            it(`should remove the 'delete' and 'update' permissions`, function () {
                Roles.removeRolePerms(['delete', 'update'], roleId);
                chai.assert.equal(Roles.roleCan('delete', roleId), false);
                chai.assert.equal(Roles.roleCan('update', roleId), false);
            });
        });

        /**
         * Roles.getRolePerms
         */

        describe(`Roles.getRolePerms(roleId) `, function () {
            it(`should return an array`, function () {
                chai.assert.equal(Roles.getRolePerms(roleId) instanceof Array, true);
                chai.assert.isAbove(Roles.getRolePerms(roleId).length, 0);
            });
        });

        /**
         * Roles.setRolePerms
         */

        describe(`Roles.setRolePerms(['test', 'setup'], roleId) `, function () {
            it(`should replace all permissions by 'test' and 'setup'`, function () {
                chai.assert.equal(Roles.setRolePerms(['test', 'setup'], roleId), true);
                chai.assert.equal(Roles.roleCan(['test', 'setup'], roleId), true);
            });
        });

        /**
         * Roles.checkRolePerms
         */

        describe(`Roles.checkRolePerms('test', roleId) `, function () {
            it(`should not throw an error`, function () {
                chai.assert.doesNotThrow((function () {
                    Roles.checkRolePerms('test', roleId);
                }), Meteor.Error);
            });
        });

        describe(`Roles.checkRolePerms(['test', 'setup'], roleId) `, function () {
            it(`should not throw an error`, function () {
                chai.assert.doesNotThrow((function () {
                    Roles.checkRolePerms(['test', 'setup'], roleId);
                }), Meteor.Error);
            });
        });

        describe(`Roles.checkRolePerms('', roleId) `, function () {
            it(`should throw an error`, function () {
                chai.assert.throw((function () {
                    Roles.checkRolePerms('', roleId);
                }), Meteor.Error);
            });
        });

        describe(`Roles.checkRolePerms([], roleId) `, function () {
            it(`should throw an error`, function () {
                chai.assert.throw((function () {
                    Roles.checkRolePerms([], roleId);
                }), Meteor.Error);
            });
        });

        describe(`Roles.checkRolePerms(['test', ''], roleId) `, function () {
            it(`should throw an error`, function () {
                chai.assert.throw((function () {
                    Roles.checkRolePerms(['test', ''], roleId);
                }), Meteor.Error);
            });
        });

        describe(`Meteor.roles.remove({name: "Tester"})`, function () {
            it(`should remove the 'Tester' role`, function () {
                chai.assert.equal(Meteor.roles.remove({name: "Tester"}), 1);
            });
        });
    }
    /**
     * Client tests
     */
    else if (Meteor.isClient) {

        // describe(`Meteor.subscribe('roles')`, function () {
        //     it(`should give access to roles`, function (done) {
        //         Meteor.subscribe('roles', function () {
        //             chai.assert.isAbove(Meteor.roles.find({}).count(), 0);
        //             done();
        //         });
        //     });
        // });
        //
        // describe(`Meteor.roleId()`, function () {
        //     it(`should return a String`, function () {
        //         chai.assert.isString(Meteor.roleId());
        //     });
        // });
        //
        // describe(`Meteor.role()`, function () {
        //     it(`should return an object`, function () {
        //         chai.assert.isObject(Meteor.role());
        //     });
        // });
    }
});
