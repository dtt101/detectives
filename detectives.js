// Set up a collection of detectives
Detectives = new Meteor.Collection("detectives");

if (Meteor.is_client) {
  Template.thelist.detectives = function () {
	  return Detectives.find({}, {sort: {votes: -1, name: 1}});
  };
  
  Template.thelist.selected_name = function () {
     var detective = Detectives.findOne(Session.get("selected_detective"));
     return detective && detective.name;
  };

  Template.detective.selected = function () {
    return Session.equals("selected_detective", this._id) ? "selected" : '';
  };
  
  Template.thelist.events = {
    'click input.vote': function () {
      Detectives.update(Session.get("selected_detective"), {$inc: {votes: 1}});
    }
  };
  
  // sets selected detective in session
  Template.detective.events = {
    'click': function () {
      Session.set("selected_detective", this._id);
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Detectives.find().count() === 0) {
	    var detective_data = ["Sherlock Holmes",
	                 "Hercule Poirot",
	                 "Miss Marple",
	                 "Father Brown"];		
	     for (var i = 0; i < detective_data.length; i++)
	       Detectives.insert({name: detective_data[i], votes: 0});
    }
  });
}