map = function(doc) {
  if ((doc.doc_type=="tweet") && (doc.bars)) {
        //var timestamp = parseTwitterDate(doc.created_at);
        doc.bars.forEach(function(bar) {
			var key =[];
			key.push(bar.yelp_id);
			//key.push(timestamp);
			emit(key, 1);
        });
  }
}