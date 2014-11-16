window.onload = main;

/***************************
**    Global Variables    **
***************************/

var deviceIP = '192.168.1.13:8090'; //;

function main()
{
	// alert("Hello World");

	$('#setIP_button').on("click", function(e){
		setIP();
	});

	// var sources = getSources();

	var checkTwitter = setInterval(function(){
		searchTwitter("#ListenTo");
	}, 1500);

}

function soundtouch_example() {
	mojo = getSoundtouch("10.60.6.50");
    mojo.search("INTERNET_RADIO", "", "Rock", function(items) {
        alert(items);
    } );
}

function setIP()
{
	// deviceIP = $('#deviceIP')[0].value + ':8080';
	console.log('IP Set!', deviceIP);
	getSources();
}

function getSources()
{
	$.ajax({
		url: 'http://'+deviceIP+'/sources',
		method: 'GET',
		success: function(data, textStatus, jqXHR){
			console.log(data);
		},
		complete: function(jqXHR, textStatus ){
			console.log(jqXHR);
		}
	});
}
