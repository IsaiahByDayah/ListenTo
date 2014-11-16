window.onload = main;

/***************************
**    Global Variables    **
***************************/

var deviceIP = '192.168.1.22'; //;
var device;

var queue;

var checkTwitter;

var ipSet = false;

var started = false;

var termIndex = 0;

var progress_bar;

var bar_max = 1;
var bar_cur = 0;

var inc = 0;

var back;
var front;

function main()
{
	queue = [];

	back = $('#back');
	front = $('#front');

	$('#setIP_button').on("click", function(e){
		setDevice();
		ipSet = true;
		$('#search_button').removeClass('disabled');
	});

	$('#search_button').on("click", function(e){
		if(ipSet)
			searchTwitter(getSearchTerm());
	});
}

function updateProgressBar()
{
	console.log('update');
	bar_cur += inc;

	if(bar_cur > bar_max)
		bar_cur = bar_max;

	front.width(((bar_cur/bar_max)*100)+'%');
}

// function soundtouch_example() {
// 	mojo = getSoundtouch("10.60.6.50");
//     mojo.nowPlaying(function(artist, album, track, art, total_time, time) {
//       console.log(artist);
//       console.log(album);
//       console.log(track);
//       console.log(art);
//       console.log(total_time);
//       console.log(time);
//     } );
//     mojo.search("INTERNET_RADIO", "", "Rock", function(items) {
//       alert(items);
//     } );
// }

function setDevice()
{
	deviceIP = $('#deviceIP')[0].value;
	console.log('IP Set!', deviceIP);
	device = getSoundtouch(deviceIP);
	// searchTwitter(getSearchTerm());
	// startInterval();
}

// function startInterval()
// {
// 	searchTwitter("#ListenTo");
// 	checkTwitter = setInterval(function(){
// 		searchTwitter("#ListenTo");
// 	}, 1*60*1000);
// }

// function stopInterval()
// {
// 	clearInterval(checkTwitter);
// }

function handleDeezerSearch(list)
{
	// for(var i = 0, len = list.length; i < len; i++)
	if(list.length > 0)
	{
		console.log('Recieved Deezer search results.');

		var i = 0;

		var newItem = $(list[i]);
		var contains = false;
		for(var j = 0, len2 = queue.length; j < len2; j++)
		{
			// console.log($(list[j]).children('token')[0]);
			if(queue[j].children('token')[0].innerHTML == newItem.children('token')[0].innerHTML)
				contains = true;
		}

		if (!contains)
		{
			// console.log('newItem:', newItem);
			queue.push(newItem);
			var str = '';
			str += '<div class="music_option">';
				str += '<img src="'+newItem.children('logo')[0].innerHTML+'" alt="Album_Art" class="album_art">';
				str += '<div class="meta">';
					str += '<p class="title">'+newItem.children('name')[0].innerHTML+'</p>';
					str += '<p class="artist">'+newItem.children('artistname')[0].innerHTML+'</p>';
					str += '<p class="album">'+newItem.children('albumname')[0].innerHTML+'</p>';
				str += '</div>';
			str += '</div>';

			$('#queue')[0].innerHTML += str;
		}

		if (!started)
		{
			playNext();	

			progress_bar = setInterval(function(){
				updateProgressBar();
			}, 1*1000);
		}
	}

}

function playNext()
{
	started = true;
	console.log('Playing Next...');
	// console.log(queue[0].children('ContentItem')[0].outerHTML);
	device.select(queue[0].children('ContentItem')[0].outerHTML, function(data){
		handleSelect(data);
	});
	queue.splice(0,1);

	var curTrack = $('#queue').children(":first-child");
	setCurTrack(curTrack);
	curTrack.remove();

	setTimeout(function(){
		if(queue.length < 3)
			{
				console.log('Need more tracks. Searching for more songs...');
				searchTwitter(getSearchTerm());
			}
	}, 5*1000);
}


function setCurTrack(track)
{
	console.log('Track:', track);
	$('#curCover').attr('src', track.find('img').attr('src'));
	$('#curTitle').text(track.find('.title').text());
	$('#curArtist').text(track.find('.artist').text());
	$('#curAlbum').text(track.find('.album').text());
}


function handleSelect(data)
{
	// console.log(data);

	if(queue.length < 5)
		searchTwitter(getSearchTerm());

	setTimeout(function(){
		device.nowPlaying(function(data){
			handleNowPlaying(data);
		});
	}, 1*1000);
}

function handleNowPlaying(data)
{
	var total_time;
	var current_time;

	var time = data.find('time');

	// console.log(data);
	// console.log(time);
	total_time = parseInt(time.attr('total'));
	current_time = parseInt(time.text());

	var time_left = total_time-current_time;

	bar_max = total_time;
	bar_cur = current_time;
	inc = 1;

	console.log('Time before next track: ' + time_left + 'seconds.');

	setTimeout(function(){
		playNext();
	}, (time_left*1000));

	// if(queue.length < 5)
	// 	searchTwitter("#CurrentlyPlaying");
}

function getSearchTerm()
{
	var options = [,'#ListenTo','#ListeningTo','#NowPlaying','#CurrentlyPlaying'];
	// return options[Math.floor(Math.random() * options.length-1)];
	termIndex++;

	if(termIndex >= options.length)
		termIndex = 0;

	return options[termIndex];
}
