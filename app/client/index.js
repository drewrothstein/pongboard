Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Deps.autorun(function(){
  Meteor.subscribe('players');
});

/** options for the spinner package */
Meteor.Spinner.options = {
  // The number of lines to draw
  lines: 13,
  // The length of each line
  length: 5,
  // The line thickness
  width: 2,
  // The radius of the inner circle
  radius: 8,
  // Corner roundness (0..1)
  corners: 0.7,
  // The rotation offset
  rotate: 0,
  // 1: clockwise, -1: counterclockwise
  direction: 1,
  // #rgb or #rrggbb
  color: '#fff',
  // revolutions per second
  speed: 1,
  // Afterglow percentage
  trail: 60,
  // Whether to render a shadow
  shadow: true,
  // Whether to use hardware acceleration
  hwaccel: false,
  // The CSS class to assign to the spinner
  className: 'spinner',
  // The z-index (defaults to 2000000000)
  zIndex: 2e9,
  // Top position relative to parent in px
  top: '20px',
  // Left position relative to parent in px
  left: 'auto'
};

// Replace this with Moment.js?
UI.registerHelper('formatDate', function(context, options) {
  if(context) {
    return moment(context).format('MMMM Do YYYY, h:mm:ss a');
  }
});

UI.registerHelper('winPercentage', function(context, options){
  if(context) {
    var totalGames;
    var user = Players.findOne({_id: context});
    totalGames = user.wins+user.losses;
    if(totalGames===0) {
      return "---"
    } else {
      return Math.round(user.wins/totalGames*100);
    }
  }
});
  
UI.registerHelper('roundRating', function(context, options) {
  if(context) {
    return Math.round(context);
  }
});

UI.registerHelper('findPlayerFromId', function(context, options){
  if(context) {
    return Players.findOne({_id: context}).name;
  }
});

UI.registerHelper('getResultClass', function(thisScore, theirScore) {
  if(thisScore > theirScore) {
    return "winner";
  } else {
    return "loser";
  }
});

UI.registerHelper('getResult', function(thisScore, theirScore) {
  if(thisScore > theirScore) {
    return "W";
  } else {
    return "L";
  }
});

Template.game_form.helpers({
  matchForm: function() {
    return MatchFormSchema;
  },
  
  players: function() {
    var p = [];
    var uTemp = Players.find({}, {sort: {name: 1}});
    uTemp.forEach(function(u) {
      var ret = { 
        value: u._id, 
        label: u.name
      };
      p.push(ret);
    });
    return p;
  }
});

Template.header.events({
  'click #menu-toggle': function() {
    $('#wrapper').toggleClass('active');
  }
});

Template.game_list.helpers({
  matches: function() {
    return Matches.find({}, {sort: {date_time: -1}});
  }
});

Template.recent_games.helpers({
  matches: function() {
    return Matches.find({}, {sort: {date_time: -1}, limit: 10});
  }
});

Template.rankings.helpers({
  players: function() {
    return Players.find({$or: [{ wins: {$gt: 0}}, {losses: {$gt: 0}}]}, {sort: {rating: -1}});
  }
});

Template.player_list.helpers({
  players: function() {
    return Players.find({}, {sort: {name: 1}});
  }
});

Template.new_players.helpers({
  players: function() {
    return Players.find({}, {sort: {date_time: -1}, limit: 10});
  }
});

Template.player_form.helpers({
  playerForm: function() {
    return PlayerFormSchema;
  }
});

Template.player_games.helpers({
  matches: function() {
    return Matches.find({$or: [{ ro_id: this._id}, {bo_id: this._id}]}, {sort: {date_time: -1}, limit: 10});
  }
});

Template.player_game_row.helpers({
  isPlayer: function(player, currentId) {
    return player._id==currentId;
  }
});

Template.player_opponents.helpers({
  getOpponents: function(playerId) {
    console.log(playerId);
    var playerCounts = {};
    var matches = Matches.find({$or: [{ ro_id: playerId}, {bo_id: playerId}]}, {});
    var players = Players.find({});
    players.forEach(function(player) {
      if(playerId!=player._id) {
        playerCounts[player._id] = 0;  
      }
    });
    
    matches.forEach(function(match){
      if (match.ro_id == playerId) {
        playerCounts[match.bo_id]++;
      } else {
        playerCounts[match.ro_id]++;
      }
    });
    
    var opponents = [];
    for (var key in playerCounts) {
      opponents.push({playerId: key, count: playerCounts[key]});
    }
    
    return opponents.sort(function(obj1, obj2) {
      // Ascending: first age less than the previous
      return obj2.count - obj1.count;
    });
  }
})