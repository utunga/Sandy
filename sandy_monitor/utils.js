
function in_bounding_box(lat, lon, bounds) { 
	// bounds are assumed to be in reverse backwards fucked up twitter polish notation
	// [lon, lat, lon, lat] format.. yes.. wtf?
	// FIXME this is, in any event all wrong because you have to do boundschecks differently in different quadrants of the earth 
	return (lon>=bounds[0] && lon<=bounds[2] && lat >= bounds[1] && lat <= bounds[3]);
};

exports.in_bounding_box = in_bounding_box;