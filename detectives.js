// Set up a collection of detectives
Detectives = new Meteor.Collection("detectives");

if (Meteor.is_client) {
  Template.thelist.detectives = function () {
	  return Detectives.find();
  };

  //Template.hello.events = {
  //  'click input' : function () {
  //    // template data, if any, is available in 'this'
  //    if (typeof console !== 'undefined')
  //      console.log("You pressed the button");
  //  }
  //};
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