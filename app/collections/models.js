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
      label: 'Team 1 Games Won*',
      min: 0,
      custom: function() {
        var teamOneGamesWon = this.value;
        var teamTwoGamesWon = this.field('bs').value;
        return checkScore(teamOneGamesWon, teamTwoGamesWon);
      }
    },
    bs: {
      type: Number,
      label: 'Team 2 Games Won*',
      min: 0,
      custom: function() {
        var teamTwoGamesWon = this.value;
        var teamOneGamesWon = this.field('rs').value;
        return checkScore(teamTwoGamesWon, teamOneGamesWon);
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
  "winBy1": "Winner must win by at least 1 game",
  "sameScore": "Game cannot end in a tie",
});

Teams.simpleSchema().messages({
  "alreadyExists": "Team already exists"
});

var checkScore = function(thisScore, theirScore) {
  if(thisScore == theirScore) {
    // no ties
    return "sameScore";
  } else if(thisScore > theirScore && thisScore < theirScore + 1) {
    // must win by 1 game
    return "winBy1";
  }
}