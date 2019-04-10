// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

// Changes the src of the #photo img and changes it to the next picture
function swapPhoto() {
    document.getElementById("photo").src = (mImages[mCurrentIndex]["img"]);
	$(document).ready(() => {
		$(".location").text("Location: " + mImages[mCurrentIndex]["location"]);
		$(".description").text("Description: " + mImages[mCurrentIndex]["description"]);
		$(".date").text( "Date: " + mImages[mCurrentIndex]["date"]);
	});
	console.log('swap photo');
}

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'images.json';

// Gets data to use from a different json file
function getQueryParams(qs) {
	qs = qs.split("+").join(" ");
	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])]
			= decodeURIComponent(tokens[2]);
	}
	return params;
}
const newUrl = (getQueryParams(document.location.search)["json"]);
if(newUrl != undefined){
	mUrl = newUrl;
}


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {

	console.log($.get(newUrl));

	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();

	// Shows/hides the details section
	$(".moreIndicator").click(() => {
		$('.details').toggle();
		$(".moreIndicator").toggleClass("rot90").toggleClass("rot270");
	});

	// Gets the previous photo in the array
	$("#prevPhoto").click(() => {
		mCurrentIndex--;
		if(mCurrentIndex < 0){
			mCurrentIndex = mImages.length-1;
		}
		swapPhoto();
	});

	// Gets the next photo in the array
	$("#nextPhoto").click(() => {
		mCurrentIndex++;
		if(mCurrentIndex > mImages.length-1){
			mCurrentIndex = 0;
		}
		swapPhoto();
	});
	
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);

function GalleryImage(img, location, description, date) {
    let image = {
        "img": img,
        "location": location,
        "description": description,
        "date": date
    }

    mImages.push(image);
}

// Gets the images from the folder and creates a GalleryImage object from it
function reqListener () {
	mJson = JSON.parse(this.responseText);

	mJson["images"].forEach((image) => {
		GalleryImage(image["imgPath"], image["imgLocation"], image["description"], image["date"]);
	});
}
mRequest.addEventListener("load", reqListener);
mRequest.open("GET", mUrl);
console.log(mRequest.send());