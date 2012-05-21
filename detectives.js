// Set up a collection of detectives
// Detectives -- {name: String,
//                description: String,
//                imagename: String,
//                votes: Number}
Detectives = new Meteor.Collection("detectives");

if (Meteor.is_client) {

	Meteor.startup(function () {
		// set session if already voted
  	if (getVoted()) {
  		Session.set("session_voted", getVoted());
  	}
  });	
	// storage helpers (uses amplify.js)
	// set that the user has voted
	var setVoted = function() {
		amplify.store("voted", true );
	};
	
	// return vote state
	var getVoted = function() {
		return amplify.store("voted");
	};
	
	// template properties
  Template.thelist.detectives = function () {
	  return Detectives.find({}, {sort: {votes: -1, name: 1}});
  };
  
  Template.detective.voted = function () {
  		return Session.get("session_voted");
  };
  
  Template.detective.events = {
    'click input.vote': function () {
			Meteor.call('vote', this._id); // update db
			Session.set("session_voted", this._id); // update reactive session
			setVoted(this._id); // update local storage
    }
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Detectives.find().count() === 0) {
	    var detective_data = [
		    ["Sherlock Holmes", "sherlock.png", ["Excellent on a crime scene", "Peerless at deduction", "The spark of creative genius that enable him to solve the toughest mysteries", "Stylish"], ["His treatment of Doctor Watson and Mrs Hudson often leaves a lot to be desired", "His arrogance often comes at a cost of some anxiety to his clients"]],
				["Hercule Poirot", "hercule.png", ["An expert at finding clues", "Amazing senstivity to relationships between strangers", "Fantastic deductive ability"], ["Annoying mannerisms", "His attitude towards Hastings is absolutely reprehensible", "The bodycount in his investigations is unacceptable, rarely does he avoid one or more repeat murders"]],
				["Columbo", "columbo.png", ["Humble, yet with a downbeat charm", "As a detective in the modern world, he solves arguably more sophisticated cases than his Victorian forebears", "A true genius, who never lets a case go 'Just one more thing...'"], ["The murderer is usually the creepy one with the sleek hairdo. It is possible Columbo has noticed this"]],
				["Miss Marple", "missmarple.png", ["Her slow, information gathering approach is a proven success", "Excellent at finding clues that others would ignore", "She rocks the old lady shtick, and is often underestimated"], ["If it comes to a throw-down, she can be in your gang", "Body-count! Just like Poirot, she struggles to keep on lid on the deaths"]],
				["Magnum PI", "magnum.png", ["Nice shirt. Nice car. Great 'tache", "Useful when things get physical", "A certain naive intellect, charm and luck"], ["Possibly not the brightest of buttons. Took him at least 5 series to work out that Higgins was Robin Masters", "Weakness for women he finds attractive"]],
				["Father Brown", "fatherbrown.png", ["A great listener, able to solve cases with the minimum of intervention", "Uses his bumbling priestly exterior to great effect", "Another astonishing mind, and open to all conclusions"], ["Like Miss Marple, he does not bring much ruckus", "His cases are often idiosyncratic to say the least"]],
			];		
      for (var i = 0; i < detective_data.length; i++) {
        Detectives.insert({
          name: detective_data[i][0],
          imagename: detective_data[i][1],
          pros: detective_data[i][2],
          cons: detective_data[i][3],
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
