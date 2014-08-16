Meteor.publish('matches', function() {
  return Matches.find();
});

Matches.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return !! userId;
  },
  remove: function(userId, doc) {
    return !! userId;
  },
  fetch: []
});

Matches.after.insert(function (userId, doc) {
  updateAllRatings(doc);
});

Matches.after.update(function (userId, doc, fieldNames, modifier, options) {
  recalc();
});

Meteor.publish('teams', function() {
  var fields = {
    _id:1,
    date_time: 1,
    name:1,
    wins:1,
    losses:1
  }
  return Teams.find({}, {fields: fields});
});

Teams.allow({
  insert: function() {
    return true;
  },
  update: function(userId, doc) {
    return !! userId;
  },
  fetch: []
});

var updateAllRatings = function(doc) {
  var red_won;
  var newWins1, newWins2, newLosses1, newLosses2;
  if (parseInt(doc.rs) > parseInt(doc.bs)) {
    red_won = true;
  } else {
    red_won = false;
  }
  
  var user1 = Teams.findOne({"_id": doc.ro_id});
  var user2 = Teams.findOne({"_id": doc.bo_id});
  
  // Calculate new win/ loss counts
  if(red_won) {
    newWins1 = user1.wins + 1;
    newLosses1 = user1.losses;
    newWins2 = user2.wins;
    newLosses2 = user2.losses + 1;
  } else {
    newWins1 = user1.wins;
    newLosses1 = user1.losses + 1;
    newWins2 = user2.wins + 1;
    newLosses2 = user2.losses;
  }
  
  // Update user data
  Teams.update(user1._id,{
    $set : {
      'wins':newWins1,
      'losses':newLosses1
    }
  });
  Teams.update(user2._id,{
    $set : {
      'wins':newWins2,
      'losses':newLosses2
    }
  });
};

var recalc = function() {
  console.log('recalculating ratings');

  var teams = Teams.find({}, {sort: {date_time: 1}});
  teams.forEach(function(team) {
    // add an initial rating for each rating being tracked
    Teams.update(team._id,{
      $set : {
        'wins': 0,
        'losses': 0
      }
    });
  });

  var matches = Matches.find({}, {sort: {date_time: 1}});
  matches.forEach(function(match) {
    var doc = ({
      ro_id: match.ro_id,
      bo_id: match.bo_id,
      rs: match.rs,
      bs: match.bs
    });
    updateAllRatings(doc);
  });
}

Meteor.methods({
  deleteMatch: function (id) {
    Matches.remove(id);
    recalc();
    return true;
  }
});

Meteor.startup(function() {
  if(Teams.find().count()>0 && Matches.find().count()>0) {
    recalc();
  }
});