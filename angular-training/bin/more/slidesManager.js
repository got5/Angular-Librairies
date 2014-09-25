(function(){

	var fs= require('fs'),
		disableRemarks= process.env.DISABLE_REMARKS,
		slidesData= null;


	var getSlides= function(slidesPath, theCallback){

		fs.readFile(slidesPath, 'utf8',

			function (err, data) {

				console.log('reading');

			  if (err) {
			    console.log('Error: ' + err);
			    return;
			  }

			  data= data
			  	.replace(/\\\r\n/g, ' ');
			  slidesData= JSON.parse(data);

			  if (disableRemarks){
				  for (var currentSlide in slidesData){
				  	delete currentSlide.remarks;
				  }
				}

				theCallback(slidesData);
			}

		 );	

	}

	module.exports= {'disableRemarks': disableRemarks, 'getSlides':getSlides };

}
)();