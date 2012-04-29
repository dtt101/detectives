// Set up a collection of detectives
// Detectives -- {name: String,
//                description: String,
//                imagename: String,
//                votes: Number}
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
			Meteor.call('vote', Session.get("selected_detective"));
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
	                 "Columbo",
									 "Miss Marple",
	                 "Magnum PI",
	                 "Father Brown"];		
      for (var i = 0; i < detective_data.length; i++) {
        Detectives.insert({
          name: detective_data[i],
          description: 'test',
          imagename: 'test.png',
          votes: 0
       });
      }
    }
  });
  
  Meteor.methods({
  	vote: doVote,
  });
  
	function doVote(detective_id) {
		Detectives.update(detective_id, {$inc: {votes: 1}});
	}
}
