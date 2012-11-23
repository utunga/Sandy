map = function(doc) {
  if ((doc.doc_type=="tweet") && (doc.bars)) {
        //var timestamp = parseTwitterDate(doc.created_at);
        doc.bars.forEach(function(bar) {
			var key =[];
			var rough_loc = bar.rough_loc;
			if (   rough_loc == "Manhattan" 
				|| rough_loc == "Brooklyn" 
				|| rough_loc == "Queens") {
				rough_loc = "nyc"
			}
			key.push(rough_loc);
			key.push(bar.yelp_id);
			key.push(bar.name);
			//key.push(timestamp);
			emit(key, 1);
        });
  }
}