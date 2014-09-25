'use strict';


/** Filter example */
application.filter('split', function() {
	return function(input, nbChars, uppercase) {
		var out = input;
		if (input.length > nbChars) {
			out = input.substring(0, nbChars) + "...";
		}
		// conditional based on optional argument
		if (uppercase) {
			out = out.toUpperCase();
		}
		return out;
	};
});