function(e) {
    $.log("in update title");
    var media_mode = (window.location.toString().match(/media/));

    if (media_mode)
	{
		title = "Images from geo-located tweets, mentioning #sandy";
	}
	else
    {
        title = "Geo-located tweets from East Coast region, mentioning #sandy";
	}
	
    return [{"title":title}];
}