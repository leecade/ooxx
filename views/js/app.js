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