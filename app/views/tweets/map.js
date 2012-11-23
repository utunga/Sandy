function parseTwitterDate(text) {
	if (!Date.prototype.toISOString) {
			//with luck it should do this once only - if at all
		    Date.prototype.toISOString = function() {
	        function pad(n) { return n < 10 ? '0' + n : n }
	        return this.getUTCFullYear() + '-'
	            + pad(this.getUTCMonth() + 1) + '-'
	            + pad(this.getUTCDate()) + 'T'
	            + pad(this.getUTCHours()) + ':'
	            + pad(this.getUTCMinutes()) + ':'
	            + pad(this.getUTCSeconds()) + 'Z';
	    };
	}
	var newtext = text.replace(/(\+\S+) (.*)/, '$2 $1')
	var date = new Date(Date.parse(newtext)); 
	return date.toISOString();
};

String.prototype.linkify = function() {
    return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(m) {
           return m.link(m);
   });
};

map = function(doc) {
    if (doc.doc_type=="tweet")
    {
        var timestamp = parseTwitterDate(doc.created_at);
        var geo_lat = doc.lat;
        var geo_lon = doc.lon;
        // all messages sorted by timestamp
        key = []
        key.push(timestamp)
  
        if (doc.text.match(/sandy/)) {
            var p = doc.user || {};

            emit(key, {
                linkified_text: doc.text.linkify(),
                tweet_id : doc.id_str,
                screen_name : p.screen_name,
                name : p.name,
                timestamp: timestamp,
                user_profile_image_url: p.profile_image_url,
                created_at: doc.created_at,
                geo_lat: geo_lat,
                geo_lon: geo_lon,
                doc_id: doc._id
            });
        }
    }
}