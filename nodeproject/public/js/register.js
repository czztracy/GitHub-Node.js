define(function(){
	var user = function(){
		$(function(){
			$(".orEmail a").click(function(){
				$(".item-email-wrap").css("display", "block");
				$(".orEmail a").css("display", "none");
			})

			$(".orPhone a").click(function(){
				$(".item-email-wrap").css("display", "none");
				$(".orEmail a").css("display", "block");
			})

			//获得焦点
			$("#register-form .form-item").find("input").focus(function(){
				$(this).parent().find("txt").css("display", "none");
				$(this).parent().next().find("span").css("display", "block");
			})
			//失去焦点
			$("#register-form .form-item").find("input").blur(function(){
				if(!$(this).val() == ''){

				}else{
					$(this).parent().find("txt").css("display", "block");
				}
				$(this).parent().next().find("span").css("display", "none");
			})

			//用户名
			$("#register-form .form-item").eq(0).find("input").blur(function(){

				if(!$(this).val() == ''){
					ajax({username: $(this).val()})
					if(!/^\w{4,20}$/.test($("#register-form .form-item").eq(0).find("input").val())){
						$(this).parent().css("border", "1px solid red");
						$(this).parent().next().find("span").eq(0).html("用户名长度只能为4-20个字节，由数字字母下划线组成").css("color", "red").css("display", "block");
					}else if(/^\d/.test($("#register-form .form-item").eq(0).find("input").val())){
						$(this).parent().next().find("span").eq(0).html("用户名首字母不能为数字").css("color", "red").css("display", "block");
						$(this).parent().css("border", "1px solid red");
					}else{
						$(this).parent().css("border", "1px solid #ddd");
						$(this).parent().next().find("span").css("display", "none");
						$(this).parent().next().find("span").eq(0).html("");
					}
					$(".btn-register").removeAttr("disabled");
				}else{
					$(this).parent().css("border", "1px solid red");
					$(this).parent().next().find("span").eq(0).html("请输入用户名").css("color", "red").css("display", "block");
					$(".btn-register").attr("disabled", "disabled");
				}
			})
			//密码
			$("#register-form .form-item").eq(1).find("input").blur(function(){
				if(!$(this).val() == ''){
					if(!/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,20}$/.test($("#register-form .form-item").eq(1).find("input").val())){
						$(this).parent().css("border", "1px solid red");
						$(this).parent().next().find("span").eq(0).html("用户名长度只能为6-20个字节,由字母、数字和符号两种以上组合").css("color", "red").css("display", "block");
					}else{
						$(this).parent().css("border", "1px solid #ddd");
						$(this).parent().next().find("span").css("display", "none");
						$(this).parent().next().find("span").eq(0).html("");
					}
					$(".btn-register").removeAttr("disabled");
				}else{
					$(this).parent().css("border", "1px solid red");
					$(this).parent().next().find("span").eq(0).html("请输入密码").css("color", "red").css("display", "block");
					$(".btn-register").attr("disabled", "disabled");
				}
			})
			//确认密码
			$("#register-form .form-item").eq(2).find("input").blur(function(){
				if(!$(this).val() == ''){
					if($(this).val() != $("#register-form .form-item").eq(1).find("input").val()){
						$(this).parent().css("border", "1px solid red");
						$(this).parent().next().find("span").eq(0).html("密码不一致").css("color", "red").css("display", "block");
					}else{
						$(this).parent().css("border", "1px solid #ddd");
						$(this).parent().next().find("span").css("display", "none");
						$(this).parent().next().find("span").eq(0).html("");
					}
					$(".btn-register").removeAttr("disabled");
				}else{
					$(this).parent().css("border", "1px solid red");
					$(this).parent().next().find("span").eq(0).html("请确认密码").css("color", "red").css("display", "block");
					$(".btn-register").attr("disabled", "disabled");
				}
			})
			//邮箱验证
			$("#register-form .form-item").eq(3).find("input").blur(function(){
				if($(this).val() != ''){
					if(!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test($(this).val())){
						$(this).parent().css("border", "1px solid red");
						$(this).parent().next().find("span").eq(0).html("邮箱格式不正确").css("color", "red").css("display", "block");
					}else{
						$(this).parent().css("border", "1px solid #ddd");
						$(this).parent().next().find("span").css("display", "none");
						$(this).parent().next().find("span").eq(0).html("");
					}
					$(".btn-register").removeAttr("disabled");
				}else{
					$(this).parent().css("border", "1px solid red");
					$(this).parent().next().find("span").eq(0).html("请填写邮箱").css("color", "red").css("display", "block");
					$(".btn-register").attr("disabled", "disabled");
				}
			})
			//手机验证
			$("#register-form .form-item").eq(4).find("input").blur(function(){
				if(!$(this).val() == ''){
					if(!/^1[3|4|5|8][0-9]\d{4,8}$/.test($(this).val())){
						$(this).parent().css("border", "1px solid red");
						$(this).parent().next().find("span").eq(0).html("手机号码有误，请重新填写").css("color", "red").css("display", "block");
					}else{
						$(this).parent().css("border", "1px solid #ddd");
						$(this).parent().next().find("span").css("display", "none");
						$(this).parent().next().find("span").eq(0).html("");
					}
					$(".btn-register").removeAttr("disabled");
				}else{
					$(this).parent().css("border", "1px solid red");
					$(this).parent().next().find("span").eq(0).html("请填写手机号码").css("color", "red").css("display", "block");
					$(".btn-register").attr("disabled", "disabled");
				}
			})

			function ajax(obj){
				$.ajax({
					url: '/users/ajax',
					data: obj,
					type: "GET",
					dataType: "json",
					success: function(data){
						if(data == '100'){
							alert('用户名已存在');
							$(".btn-register").attr("disabled", "disabled");
						} /*else {
							$(".btn-register").removeAttr("disabled");
						}*/
					}
				})
			}
		})
	}
	return{
		user:user
	}
})