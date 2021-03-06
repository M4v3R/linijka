Template.postItem.helpers({
    time: function() {
        return moment(this.added_on).fromNow();
    },
    author: function() {
        var author = Meteor.users.findOne(this.author);
        return author.username || author.profile.name;
    },
    voted: function() {
        var user_id = Meteor.userId();
        if (!user_id) return;

        if (_.contains(this.upvoters, user_id) || _.contains(this.downvoters, user_id))
            return "voted";
    },
    comments_text: function() {
        var n = this.comments_num;
        if (n == 1) return "komentarz";
        if (n % 100 >= 10 && n % 100 <= 20) return "komentarzy";
        if (n % 10 > 1 && n % 10 < 5) return "komentarze";
        return "komentarzy";
    }
});

Template.postItem.events({
    'click a.post-vote': function(e) {
        e.preventDefault();

        var el = $(e.target);
        var voteType;

        if (el.hasClass('vote-up'))
            voteType = 'up';
        else
            voteType = 'down';

        var vote = {
            postId: el.parents('.post').data('post-id'),
            type: voteType
        }

        Meteor.call('postVote', vote, function(error, result) {
            if (error) return alert(error.reason);
        });
    }
});
