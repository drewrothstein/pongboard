// global router configuration
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

Router.map(function() {
  // Home
  this.route('home', {
    path: '/',
    waitOn: function() {
      return [Meteor.subscribe('teams'),
              Meteor.subscribe('matches', {sort: {date_time: -1}, limit: 10})];
    }
  });

  // Add Game
  this.route('add_game', {
    path: '/games/add',
    data: {
      formType: "insert",
      game: null
    },
    waitOn: function() {
      return [Meteor.subscribe('teams'),
              Meteor.subscribe('matches', {sort: {date_time: -1}, limit: 10})];
    }
  });
  
  // Edit game
  this.route('edit_game', {
    path: '/games/:_id/edit',
    data: function(){
      match = Matches.findOne(this.params._id);
      return { formType: "update", game: match};
    },
    waitOn: function() {
      return [Meteor.subscribe('teams'),
              Meteor.subscribe('matches', {sort: {date_time: -1}, limit: 10})];
    }
  });
  
  // Add Team
  this.route('add_team', {
    path: '/teams/add',
    data: {
      formType: "insert",
      team: null
    },
    waitOn: function() {
      return [Meteor.subscribe('teams')];
    }
  });
  
  // Edit game
  this.route('edit_team', {
    path: '/teams/:_id/edit',
    data: function(){
      p = Teams.findOne(this.params._id);
      return { formType: "update", team: p};
    },
    waitOn: function() {
      return [Meteor.subscribe('teams')];
    }
  });

  // Rankings
  this.route('rankings', {
    path: '/rankings',
    waitOn: function() {
      return [Meteor.subscribe('teams'),
              Meteor.subscribe('matches')];
    }
  });
  
  // Game List
  this.route('game_list', {
    path: '/games',
    waitOn: function() {
      return [Meteor.subscribe('teams'),
              Meteor.subscribe('matches')];
    }
  });
  
  // Team List
  this.route('team_list', {
    path: '/teams',
    waitOn: function() {
      return [Meteor.subscribe('teams')];
    }
  });
  
  // Individual Team Page
  this.route('team_page', {
    path: '/teams/:_id',
    waitOn: function() {
      return [Meteor.subscribe('teams'),
              Meteor.subscribe('matches')];
    },
    data: function() { 
      return Teams.findOne(this.params._id);
    }
  });

  // About
  this.route('about', {
    path: '/about'
  });

  // Not-found Page
  this.route('notFound', {
    path: '*'
  });
});

Router.onBeforeAction('loading');