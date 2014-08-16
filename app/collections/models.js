// using autoform, simple-schema, and Collections2 packages to validate inserts
// against schema to ensure data integrity
Matches = new Meteor.Collection('matches', {
  schema: {
    date_time: {
      type: Number
    },
    ro_id: {
      type: String,
      label: 'Team 1*',
      custom: function () {
        if (this.value == this.field('bo_id').value) {
          return "sameTeam";
        }
      }
    },
    bo_id: {
      type: String,
      label: 'Team 2*',
      custom: function () {
        if (this.value == this.field('ro_id').value) {
          return "sameTeam";
        }
      }
    },
    rs: {
      type: Number,
      label: 'Team 1 Score*',
      min: 0,
      custom: function() {
        var thisScore = this.value;
        var theirScore = this.field('bs').value;
        return checkScore(thisScore, theirScore);
      }
    },
    bs: {
      type: Number,
      label: 'Team 2 Score*',
      min: 0,
      custom: function() {
        var thisScore = this.value;
        var theirScore = this.field('rs').value;
        return checkScore(thisScore, theirScore);
      }
    }
  }
});

Teams = new Meteor.Collection('teams', {
  schema: {
    name: {
      type: String,
      label: 'Name*',
      min: 2,
      custom: function() {
        var id = Teams.findOne({name: this.value});
        if (id) {
          // team already in database, no need to add again
          console.log('id already exists: ' + id._id);
          return "alreadyExists";
        }
      }
    },
    date_time: {
      type: Number
    },
    rating: {
      type: Number,
      min: 0
    },
    wins: {
      type: Number,
      min: 0
    },
    losses: {
      type: Number,
      min: 0
    }
  }
});

Matches.simpleSchema().messages({
  "sameTeam": "Teams can not be the same",
  "winBy2": "Winner must win by at least 2 points",
  "sameScore": "Game cannot end in a tie",
  "playTo11": "Winner must have at least 11 points",
  "illegalOvertime": "Winner can't win by more than 2 points if opponent has at least 10 points"
});

Teams.simpleSchema().messages({
  "alreadyExists": "Team already exists"
});

var checkScore = function(thisScore, theirScore) {
  if(thisScore == theirScore) {
    // no ties
    return "sameScore";
  } else if(thisScore > theirScore && thisScore < 11) {
    // winner must be 11 or greater
    return "playTo11";
  } else if(thisScore > theirScore && thisScore < theirScore + 2) {
    // must win by 2
    return "winBy2";
  } else if(thisScore > theirScore && theirScore >= 10 && thisScore - theirScore != 2) {
    // if the losing score is 10 or higher, winning score can only be 2 points higher
    return "illegalOvertime";
  } 
}