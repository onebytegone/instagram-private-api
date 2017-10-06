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
          if (!data.reels_media.length) {
            return [];
          }

          return _.map(data.reels_media[0].items, function (medium) {
            return new Media(that.session, medium);
          });
        });
};

module.exports = UserStory;