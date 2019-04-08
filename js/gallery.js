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
    const photo = document.getElementById("photo")
    photo.src = (mImages[mCurrentIndex]["img"]);
	console.log('swap photo');
	mCurrentIndex++;
	if(mCurrentIndex > mImages.length){
	    mCurrentIndex = 0;
    }
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
var mUrl = 'insert_url_here_to_image_json';


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();

	// Shows/hides the details section
	$(".moreIndicator, .rot90").click(() => {
		$('.details').toggle();
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
mRequest.open("GET", "images.json");
mRequest.send();
