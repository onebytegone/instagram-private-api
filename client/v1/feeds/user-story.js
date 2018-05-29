var _ = require('lodash');
var Request = require('../request');
var Media = require('../media');

function UserStory(session, userIds) {
    this.session = session;
    this.userIds = userIds.map( id => String(id) );
}

UserStory.prototype.get = function () {
    var that = this;
    return new Request(that.session)
        .setMethod('POST')
        .setResource('userStory')
        .generateUUID()
        .setData({
            user_ids: this.userIds
        })
        .signPayload()
        .send()
        .then(function(data) {
            var reels = [];

            if (data.reels_media && _.size(data.reels_media)) {
                reels = data.reels_media;
            } else if (data.reels && _.size(data.reels)) {
                reels = data.reels;
            } else {
                return [];
            }

            return _.map(_.values(reels)[0].items, function (medium) {
                return new Media(that.session, medium);
            });
        });
};

module.exports = UserStory;