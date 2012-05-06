// Set up a collection of detectives
// Detectives -- {name: String,
//                description: String,
//                imagename: String,
//                votes: Number}
Detectives = new Meteor.Collection("detectives");

if (Meteor.is_client) {
	
	// storage helpers (uses amplify.js)
	// set that the user has voted
	var setVoted = function() {
		amplify.store("voted", true );
	}

	// TODO - remove
	var setNotVoted = function() {
		amplify.store("voted", false );
	}
	
	// return vote state
	var getVoted = function() {
		return amplify.store("voted");
	}
	
	// template properties
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
  
  Template.detective.voted = function () {
		return getVoted();
  }
  
  Template.thelist.events = {
    'click input.vote': function () {
			Meteor.call('vote', Session.get("selected_detective"));
			setVoted();
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
	    var detective_data = [["Sherlock Holmes", "test description", "sherlock.png"],
	                 ["Hercule Poirot", "test description", "hercule.png"],
	                 ["Columbo", "test description", "columbo.png"],
									 ["Miss Marple", "test description", "missmarple.png"],
	                 ["Magnum PI", "test description", "magnum.png"],
	                 ["Father Brown", "test description", "fatherbrown.png"]];		
      for (var i = 0; i < detective_data.length; i++) {
        Detectives.insert({
          name: detective_data[i][0],
          description: detective_data[i][1],
          imagename: detective_data[i][2],
          votes: 0
       });
      } 
    }
    
    // disable client db access
		 Meteor.default_server.method_handlers['/detectives/insert'] = function () {};
     Meteor.default_server.method_handlers['/detectives/update'] = function () {};
     Meteor.default_server.method_handlers['/detectives/remove'] = function () {};
  });
  
  Meteor.methods({
  	vote: doVote,
  });
  
	function doVote(detective_id) {
		Detectives.update(detective_id, {$inc: {votes: 1}});
	}
}
