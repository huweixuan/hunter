$(function() {
	$.ajax({
		url: '/get',
		type: 'get',
		dataType: 'json',
		success: function(data) {
			$('video').hunter(data);
		},
		error: function() {

		}
	});
});