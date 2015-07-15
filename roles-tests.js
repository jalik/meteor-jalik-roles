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