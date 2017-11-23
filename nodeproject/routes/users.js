var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");

//创建客户端
var MongoClient = mongodb.MongoClient;
//创建数据库链接(权限认证)
var DB_CONN_STR = 'mongodb://localhost:27017/NBA';


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//注册
router.all('/register', function(req, res, next){
	//传入数据
	var username = req.body['reName'];
	var password = req.body['password'];
	var passwordR = req.body['passwordR'];
	var Email = req.body['Email'];
	var phone = req.body['phone'];
	var Code = req.body['Code'];
	//获取用户注册的数据
	var data = [{'username': username, 'password': password, 'passwordR': passwordR, 'Email': Email, 'phone': phone, 'Code': Code}];

	function insertData(db){
		//声明操作的集合（存入数据）
		var conn = db.collection('admin');
		//进行数据插入
		conn.insert(data, function(err, results){
			if(err){
				console.log(err);
				return;
			}else{
				//注册成功后重定向到login页面
				res.redirect('/login');
				//关闭数据库
				db.close();
			}
		});
	}

	//链接数据库
	MongoClient.connect(DB_CONN_STR, function(err, db){
		if(err){
			console.log(err);
			return;
		}else{
			console.log('链接数据库成功');
			//拿到的数据 db 进行数据库操作
			insertData(db);
		}
	})
})
//登录
router.all('/login', function(req, res, next){
	//传入的数据
	var username = req.body['loginname'];
	var password = req.body['nloginpwd'];
	//得到用户的数据
	var data = {username: username, password: password}
	console.log(data);

	function findData(db){
		//到admin的集合中
		var conn = db.collection("admin");
		//查询数据库同时验证用户名密码
		conn.find(data, {username:0, password:0}).toArray(function(err, results){
			if (err) {
				console.log(err);
				return;
			}else{
				console.log(results);
				//判断查询结果 数组的长度
				if(results.length > 0){
					//数据缓存
					req.session.username = username;
					//重定向到主页
					res.redirect('/');
				}else{

					res.redirect('/login');
				}
			}
		})
	}

	//判断输入框中的数据是否存在
	if(username && password){
		//链接数据库
		MongoClient.connect(DB_CONN_STR, function(err, db){
			if(err){
				console.log(err);
				return;
			}else{
				console.log("链接成功");
				//进行数据查询
				findData(db);
			}
		})	
	}else{
		res.redirect('/register');
	}
})
//ajax查询数据库
router.all('/ajax', function(req, res, next){
	var username = req.query['username'];
	var data = {username: username};
	

	function findData(db){
		var conn = db.collection('admin');
		conn.find(data).toArray(function(err, results){
			console.log(results);
			if (err) {
				console.log(err);
				return;
			} else {
				if(results.length > 0){
					res.send('100');
				} else {
					console.log(results);
					res.send('101');
				}
				db.close();
			}
		})
	}

	MongoClient.connect(DB_CONN_STR, function(err, db){
		if (err) {
			console.log(err);
			return;
		} else {
			console.log("数据库连接成功");
			findData(db);
		}
	})
})

module.exports = router;
