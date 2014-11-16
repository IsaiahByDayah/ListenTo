window.onload = main;

/***************************
**    Global Variables    **
***************************/

var deviceIP = '192.168.1.13'; //;
var device;

var queue;

var checkTwitter;

var playing = false;

function main()
{
	queue = [];

	$('#setIP_button').on("click", function(e){
		setDevice();
	});

	$('#start_button').on("click", function(e){
		if(device != undefined)
			startInterval();
	});

	$('#stop_button').on("click", function(e){
		stopInterval();
	});

}

function soundtouch_example() {
	mojo = getSoundtouch("10.60.6.50");
    mojo.search("INTERNET_RADIO", "", "Rock", function(items) {
        alert(items);
    } );
}

function setDevice()
{
	// deviceIP = $('#deviceIP')[0].value + ':8080';
	console.log('IP Set!', deviceIP);
	device = getSoundtouch(deviceIP);
	startInterval();
}

function startInterval()
{
	searchTwitter("#ListenTo");
	checkTwitter = setInterval(function(){
		searchTwitter("#ListenTo");
	}, 1*60*1000);
}

function stopInterval()
{
	clearInterval(checkTwitter);
}

function appendTracks(list)
{
	for(var i = 0, len = list.length; i < len; i++)
	{
		var newItem = $(list[i]);
		var contains = false;
		for(var j = 0, len2 = queue.length; j < len2; j++)
		{
			// console.log($(list[j]).children('token')[0]);
			if(queue[j].children('token')[0].innerHTML == newItem.children('token')[0].innerHTML)
				contains = true;
		}

		if (!contains)
			queue.push(newItem);
	}

	if (!playing)
		playNext();	
}

function playNext()
{
	if(queue.length > 0)
		console.log(queue[0]);
	// device.select(queue[0].);
}
