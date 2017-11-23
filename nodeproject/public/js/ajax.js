
var btn = document.querySelector(".btn");
btn.onclick = function aaa(){
	$.ajax({
		url: "/users/ajax",//user.js下的ajax
		type: 'get',
		dataType: 'json',
		success: function(data){
			console.log(data);
		}
	})
}