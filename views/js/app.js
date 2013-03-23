!function(WIN, DOC, undef) {
	if(DOC.location.hash || !WIN.addEventListener) return;
			
	WIN.scrollTo(0, 1);
	
	var scrollTop = 1,
		getScrollTop = function(){
			return WIN.pageYOffset || DOC.compatMode === "CSS1Compat" && DOC.documentElement.scrollTop || DOC.body.scrollTop || 0;
		},

		//reset to 0 on bodyready, if needed
		bodycheck = setInterval(function(){
			if(DOC.body){
				clearInterval(bodycheck);
				scrollTop = getScrollTop();
				WIN.scrollTo(0, scrollTop === 1 ? 0 : 1);
			}	
		}, 15);

	WIN.addEventListener("load", function(){
		setTimeout(function(){
			if(getScrollTop() < 20){
				WIN.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
			}
		}, 0);
	});
}(window, document)

// Get url's query and put it into an object
getQuery = function (url) {
	url = url ? url : window.location.search;
	if (url.indexOf("?") < 0) return {};
	var queryParam = url.substring(url.indexOf("?") + 1, url.length).split("&"),
		queryObj = {};
	for (i = 0; j = queryParam[i]; i++){ 
        queryObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length); 
    } 
    return queryObj;
};