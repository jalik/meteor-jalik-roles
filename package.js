Package.describe({
    name: 'jalik:roles',
    version: '0.1.0',
    summary: 'Control user actions with roles',
    git: 'https://github.com/jalik/jalik-roles',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use(['minimongo', 'mongo-livedata', 'templating', 'accounts-password'], 'client');
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
