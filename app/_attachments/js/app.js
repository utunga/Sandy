db = $.couch.db("pub");
design = "app";

function drawItems() {
	
	//var state = getStateFromPath();
    var media_mode = (window.location.toString().match(/media/));
	success_callback = function(data) 
	{
        if ($(window).scrollTop() > 30) {
            $.log("skipping update because page is scrolled");
            return;
        }
		$.log("#recent-messages drawItems : results received | " + (((data) && (data.rows)) ? data.rows.length + " rows" : " !!doesnt have rows wtf!!??" ) );
        setupChanges(data.update_seq);
        var them = $.mustache($("#recent-messages").html(), {
            items : data.rows.map(function(r) {return r.value;})
        });

        $("#main_content").html(them);
        fix_relative_times();
	};
	
	view_params =  
	{
			descending : "true",
            reduce: false,
            limit : 50,
            update_seq : true,
            success : success_callback
	};
	
	if (media_mode)
	{
		db.view(design + "/media_tweets",view_params);
	}
	else
	{
		//view_params.startkey =[state.loc,{}] ;
		db.view(design + "/tweets",view_params);
	}
//	else if (state.bar!==undefined)
//	{
//		view_params.startkey =[state.bar,{}] ;
//		db.view(design + "/tweets_by_bar",view_params);
//	}
	
	
};

var changesRunning = false;
function setupChanges(since) {
    if (!changesRunning) {
        var changeHandler = db.changes(since);
        changesRunning = true;
        changeHandler.onChange(drawItems);
    }
}


// Apache 2.0 J Chris Anderson 2011
$(function() {   
    // friendly helper http://tinyurl.com/6aow6yn
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
   
	$.log(" ---------page load-------------- ");
	drawItems();
    
	// see comment at bottom for couch login code bit that used to be here
 });


////silly to have to implement this state parser
////feels like it should just be a property on
////pathBinder.. but can't find it so implementing a custom one
//function getStateFromPath()
//{
//	var matches = window.location.toString().match(/^[^#]*(#.+)$/);
//	var path = (matches) ? matches[1] : '';
//
//	//$.log("parsing path:" + path);
//
//	var paths = path.split("/");
//	var type = undefined;
//	var loc = undefined;
//
//	//paths[0] will always be #
//	if (paths.length==2 && paths[1]!="")
//	{
//		  type = paths[1];
//	}
//	else if (paths.length==3 && paths[2]!="")
//	{
//		  loc = paths[1];
//		  type = paths[2];
//	}
//
//	if (loc=="any")
//		loc = undefined;
//
//	$.log("state via url: path " + path + " -> state =  {type:" + type + " loc:" + loc + "}");
//	return {"type": type, "loc":loc};
//
//};


//$.couch.app() loads the design document from the server and 
//then calls this function
$.couch.app(
	function(app) { 
		$("#bars").evently("bars", app);
		$("#curr_title").evently("curr_title", app);
		   
		$.pathbinder.onChange(function(path) {
			$.log(" -------pathbinder change-------------- ");
			//app.state = getStateFromPath();
			//$("#bars").trigger("render");
			//$("#curr_title").trigger("update_title");
			drawItems();
		});
		//app.state = getStateFromPath();
		//$("#bars").trigger("init");
		$.log("in couchapp def");
	}
	,
	{
		design : "app",
		db: "pub"//, 
		//urlPrefix: window.location.protocol + "://" + window.location.host
	});
//helper functions

function fix_relative_times() {
	$("#main_content .created_at_time").each(function(index) {
		// inner text starts out (after mustache template) as tweet.created_date
		// convert this to a relative time (inside browser for obvious reasons)
		$(this).text(relative_time($(this).text()));
	});
}

function relative_time(time_value) {
	var values = time_value.split(" ");
	time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
	var parsed_date = Date.parse(time_value);
	var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	delta = delta + (relative_to.getTimezoneOffset() * 60);
	
	var r = '';
	if (delta < 60) {
	      r = 'a minute ago';
	} else if(delta < 120) {
	      r = 'couple of minutes ago';
	} else if(delta < (45*60)) {
	      r = (parseInt(delta / 60)).toString() + ' minutes ago';
	} else if(delta < (90*60)) {
	      r = 'an hour ago';
	} else if(delta < (24*60*60)) {
	      r = '' + (parseInt(delta / 3600)).toString() + ' hours ago';
	} else if(delta < (48*60*60)) {
	      r = '1 day ago';
	} else {
	      r = (parseInt(delta / 86400)).toString() + ' days ago';
	}
	return r;
};



// couch login bits that were originally in couchapp default deploy
//Apache 2.0 J Chris Anderson 2011
//$(function() { 
// ...<snip>
//
// $.couchProfile.templates.profileReady = $("#new-message").html();
//  $("#account").couchLogin({
//    loggedIn : function(r) {
//      $("#profile").couchProfile(r, {
//          profileReady : function(profile) {
//              $("#create-message").submit(function(e){
//                  e.preventDefault();
//                  var form = this, doc = $(form).serializeObject();
//                  doc.created_at = new Date();
//                  doc.profile = profile;
//                  db.saveDoc(doc, {success : function() {form.reset();}});
//                  return false;
//              }).find("input").focus();
//          }
//      });
//    },
//    loggedOut : function() {
//        $("#profile").html('<p>Please log in to see your profile.</p>');
//    }
//  });
// 
//});
