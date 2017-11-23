require.config({
	path:{
		'jquery': 'jquery',
		'register': 'register'
	}
})


require(['jquery', 'register'], function($, register){
	register.user();
})