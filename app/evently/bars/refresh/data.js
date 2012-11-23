function(data) {
  
  function getBarURI(loc, bar) 
  {	
	return "#/" + encodeURIComponent(loc) + "/" + encodeURIComponent(bar);
  }
  
  function getAnyStateUri(state) 
  {
	if (state.loc===undefined)
  		return "#/";
	
	if (state.loc!==undefined)
  		return "#/loc/" + encodeURIComponent(state.loc);
	
  }
  
  state = $$(this).app.state;
  curr_bar = state.bar;
  //$.log("in bar render : state.loc = " + state.loc);
  //$.log("in bar render : state.bar = " + state.bar);
  $.log("in bar render : results received " + (((data) && (data.rows)) ? data.rows.length + " rows" : " !!doesnt have rows wtf!!??" ) );

  var bars = data.rows.map(function(r) {
    return {
      loc : r.key[0],
      yelp_name : r.key[1],
      state_uri : getBarURI(r.key[0],r.key[1]),
      name : r.key[2],
      count : r.value,
      class_str: ((r.key[1]==curr_bar) ? "class='current'" : "")
    };
  });
  
  bars.sort(function(a,b) {
    var countDiff = b.count - a.count;
     if (countDiff!=0) return countDiff; // sort by count first
     return b.yelp_name - a.yelp_name; // then by alpha (just to keep it stable
  })
  
  bars.insertAt(0, {
	  yelp_name : "any",
      state_uri : getAnyStateUri(state),
	  count : Number.MAX_VALUE,
      class_str: ((curr_bar==undefined) ? "class='current'" : "")
  }); 
  
  min_count = ((bars.length>50) ? bars[50].count : 2);
  
  bars = bars.filter(function(bar) {
       return (bar.count >= min_count);
  });
  
  return {bars:bars};
}
