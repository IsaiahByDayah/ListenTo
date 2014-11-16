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
		console.log(token);
	}
});

function searchTwitter(q)
{
	$.ajax({
		url: 'https://api.twitter.com/1.1/search/tweets.json?q='+encodeURIComponent(q),//'https://twitter.com/search?q=#ListenTo',
		method: 'GET',
		beforeSend: function(jqXHR){
			jqXHR.setRequestHeader("Authorization", "Bearer " + token);
			jqXHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
		},
		data: 'grant_type=client_credentials',
		success: function(data, textStatus, jqXHR){
			console.log(data);
		}
	});
}