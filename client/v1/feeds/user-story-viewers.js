var _ = require('lodash');
var util = require('util');
var FeedBase = require('./feed-base');
var Exceptions = require('../exceptions');

function UserStoryViewersFeed(session, mediaId, limit) {
    this.mediaId = mediaId;
    this.limit = limit;
    FeedBase.apply(this, arguments);
}
util.inherits(UserStoryViewersFeed, FeedBase);

module.exports = UserStoryViewersFeed;
var Request = require('../request');
var Account = require('../account');

UserStoryViewersFeed.prototype.get = function () {
    var that = this;

    return new Request(that.session)
        .setMethod('GET')
        .setResource('userStoryViewers', {
            mediaId: that.mediaId,
            maxId: that.getCursor()
        })
        .send()
        .then(function(data) {
            that.moreAvailable = !!data.next_max_id;
            if (that.moreAvailable) {
                that.setCursor(data.next_max_id);
            }

            return _.map(data.users, function (user) {
                return new Account(that.session, user);
            });
        })
        .catch(function (reason) {
            if(reason.json.message === 'Media is unavailable') throw new Exceptions.MediaUnavailableError();
            else throw reason;
        })
};
