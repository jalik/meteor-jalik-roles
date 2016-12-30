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

Package.describe({
    name: 'jalik:roles',
    version: '0.2.0',
    author: 'karl.stein.pro@gmail.com',
    summary: 'Simple and efficient way to manage users permissions using roles',
    homepage: 'https://github.com/jalik/jalik-roles',
    git: 'https://github.com/jalik/jalik-roles.git',
    documentation: 'README.md',
    license: 'MIT'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.5.1');
    api.use('check@1.2.1');
    api.use('ecmascript@0.4.3');
    api.use('mongo@1.1.7');
    api.use('tracker@1.0.13', 'client');
    api.use('templating@1.1.9', 'client');
    api.use('underscore@1.0.8');
    api.mainModule('roles.js');
});

Package.onTest(function (api) {
    // api.use('accounts-base@1.2.7');
    // api.use('accounts-password@1.1.8');
    api.use('ecmascript@0.4.3');
    api.use('practicalmeteor:mocha');
    api.use('jalik:roles');
    api.mainModule('roles-tests.js');
});
