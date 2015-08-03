Package.describe({
    name: 'jalik:roles',
    version: '0.1.2',
    author: 'karl.stein.pro@gmail.com',
    summary: 'Easy but strong way to manage users permissions in your Meteor apps.',
    homepage: 'https://github.com/jalik/jalik-roles',
    git: 'https://github.com/jalik/jalik-roles.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use(['accounts-password', 'minimongo', 'mongo-livedata', 'templating', 'tracker'], 'client');
    api.use(['mongo'], 'server');
    api.addFiles('roles.js');
    api.export('Roles');
});

Package.onTest(function (api) {
    api.use(['accounts-password'], 'client');
    api.use('tinytest');
    api.use('jalik:roles');
    api.addFiles('roles-tests.js');
});
