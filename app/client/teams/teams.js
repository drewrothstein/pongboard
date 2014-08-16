Template.rankings.helpers({
  teams: function() {
    return Teams.find({$or: [{ wins: {$gt: 0}}, {losses: {$gt: 0}}]}, {sort: {wins: -1}});
  }
});

Template.team_form.events({
  'click button.cancel': function () {
    history.back();
  },
})

Template.team_list.helpers({
  teams: function() {
    return Teams.find({}, {sort: {name: 1}});
  },
  teamCount: function() {
    return Teams.find({}).count();
  }
});

Template.new_teams.helpers({
  teams: function() {
    return Teams.find({}, {sort: {date_time: -1}, limit: 10});
  }
});

Template.team_games.helpers({
  matches: function() {
    return Matches.find({$or: [{ ro_id: this._id}, {bo_id: this._id}]}, {sort: {date_time: -1}, limit: 10});
  }
});

Template.team_game_row.helpers({
  isTeam: function(team, currentId) {
    return team._id==currentId;
  }
});

Template.team_opponents.helpers({
  getOpponents: function(teamId) {
    var teamCounts = {};
    var matches = Matches.find({$or: [{ ro_id: teamId}, {bo_id: teamId}]}, {});
    var teams = Teams.find({});
    
    // Initialize data
    teams.forEach(function(team) {
      if(teamId!=team._id) {
        teamCounts[team._id] = {
          games: 0, 
          wins: 0, 
          losses: 0
        };  
      }
    });
    
    // Get data for each match
    matches.forEach(function(match){
      if (match.ro_id == teamId) {
        // Current team is red
        teamCounts[match.bo_id].games++;
        if(match.rs>match.bs) {
          // if red (current team) won
          teamCounts[match.bo_id].wins++;
        } else {
          // if blue (opponent) won
          teamCounts[match.bo_id].losses++;
        }
      } else {
        // current team is blue
        teamCounts[match.ro_id].games++;
        if(match.bs>match.rs) {
          // if red (current team) won
          teamCounts[match.ro_id].wins++;
        } else {
          // if blue (opponent) won
          teamCounts[match.ro_id].losses++;
        }
      }
    });
    
    // build opponent data array for template
    var opponents = [];
    for (var key in teamCounts) {
      opponents.push({
        teamId: key, 
        count: teamCounts[key].games,
        wins: teamCounts[key].wins,
        losses: teamCounts[key].losses
      });
    }
    
    // Sort opponents from most-played to least
    return opponents.sort(function(obj1, obj2) {
      return obj2.count - obj1.count;
    });
  }
});

// Form hooks
AutoForm.hooks({
  teamForm: {
    // add timestamp, and initial values for wins and losses.
    before: {
      insert: function(doc, template) {
        doc.date_time = Date.now();
        doc.wins = 0;
        doc.losses = 0;
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      if(operation=="update") {
        AutoForm.resetForm(teamForm);
        history.back();
      }
    }
  }
});