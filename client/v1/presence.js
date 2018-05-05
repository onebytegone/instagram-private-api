var util = require("util");
var _ = require("lodash");
var Resource = require("./resource");
var Promise = require("bluebird");
var camelKeys = require('camelcase-keys');


function Presence(session, params) {
    Resource.apply(this, arguments);
}

util.inherits(Presence, Resource);
module.exports = Presence;

var Request = require('./request');

Presence.prototype.parseParams = function (json) {
    return camelKeys(json, { deep: true });
};

Presence.get = function (session) {
    return new Request(session)
        .setMethod('GET')
        .setResource('presence')
        .send()
        .then(function(json) {
            return new Presence(session, json.user_presence);
        });
};
