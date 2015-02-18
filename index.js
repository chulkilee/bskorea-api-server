/*eslint-env node*/
'use strict';

var Hapi = require('hapi');
var Boom = require('boom');
var api = require('./api');

var server = new Hapi.Server();

server.connection({
    port: process.env.PORT
});

server.route({
    method: 'GET',
    path: '/{version}/{book}/{chapter}',
    handler: function (req, reply) {
        var version = req.params.version;
        var book = req.params.book;
        if (!api.isValidVersion(version)) {
            return reply(Boom.badRequest('Unknown version'));
        }
        if (!api.isValidBook(book)) {
            return reply(Boom.badRequest('Unknown book'));
        }
        api.get(version, book, req.params.chapter, function(verses) {
            reply(verses);
        });
    }
});

server.start();
