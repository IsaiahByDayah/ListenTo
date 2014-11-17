var CONSUMER_KEY = 'ulv1GgB1xSWigAfFldV4aPWLN';
var CONSUMER_SECRET = 'pyECKq6bgfhVDfc1P8AANnIqgsy0OsJR3OnJe9F2VgX2fURezT';

var key_urlencoded = encodeURIComponent(CONSUMER_KEY);
var secret_urlencoded = encodeURIComponent(CONSUMER_SECRET);

var concat = key_urlencoded+':'+secret_urlencoded;
var concat_base64 = btoa(concat);
// console.log(concat_base64);

var token;

$.ajax({
	url: 'https://api.twitter.com/oauth2/token',
	method: 'POST',//'GET'
	beforeSend: function(jqXHR){
		jqXHR.setRequestHeader("Authorization", "Basic " + concat_base64);
		jqXHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
	},
	data: 'grant_type=client_credentials',
	success: function(data, textStatus, jqXHR){
		token = data.access_token;
		// console.log(token);
	}
});

function searchTwitter(q)
{
	$.ajax({
		url: 'https://api.twitter.com/1.1/search/tweets.json?q='+encodeURIComponent(q)+'&count=50',//'https://twitter.com/search?q=#ListenTo',
		method: 'GET',
		beforeSend: function(jqXHR){
			jqXHR.setRequestHeader("Authorization", "Bearer " + token);
			jqXHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		},
		data: 'grant_type=client_credentials',
		success: function(data, textStatus, jqXHR){
			// console.log(data);

			console.log('Twitter Hit!');
			for(var i = 0, len = data.statuses.length; i < len; i++)
			{
				// console.log('Tweet Number '+i);
				var tweet = data.statuses[i].text.toLowerCase();
				// console.log('');
				// console.log('');
				// console.log('');
				// console.log('Tweet: ', tweet);
				var tweet2 = tweet.split(' ');
				// console.log('Tweet2: ', tweet2);
				var tweet3 = '';
				for(var j = 0, len2 = tweet2.length; j < len2; j++)
				{
					if(tweet2[j].indexOf('#') != 0)
					{
						if(tweet2[j].indexOf('@') != 0)
						{
							if(tweet2[j].indexOf('rt') != 0)
							{
								if(tweet2[j].indexOf('http') != 0)
								{
									if(tweet2[j].indexOf('by') != 0)
									{
										tweet3 += tweet2[j] + ' ';
									}
									else
									{
										break;
									}
								}
							}
							else
							{
								tweet3 = '';
								break;
							}
						}
					}
				}

				// console.log('Tweet3: ', tweet3);
				// console.log('');
				// console.log('');
				// console.log('');
				// var ind = tweet.indexOf('#currentlyplaying');
				// tweet.splice(ind, 17);
				var tweet4 = tweet3.replace(/\s/g, "");
				if(tweet4 !== '')
				{	
					// console.log('search sent...');
					device.search("DEEZER", "isaiah_smith@bose.com", encodeURIComponent(tweet4), function(list){
						// console.log(list);
						handleDeezerSearch(list);
					});
				}
			}
		}
	});
}