var express = require("express");
var router = express.Router();
var async = require('async');
//引进数据库
var mongodb = require("mongodb");
//创建客户端
var mongoClient = mongodb.MongoClient;
//创建数据库连接地址
var CONN_DB_STR = 'mongodb://localhost:27017/NBA';

//获取前段页面发送来的数据
router.all("/talk", function(req, res, next){
	//获取到输入的内容
	var title = req.body['title'];
	var val = req.body['val'];
	var date = new Date();
	mydate = date.toLocaleString();
	//获得这个用户的ID
	var username = req.session.username;
	

	function insertData(db){
		//链接到comment这个集合下
		var conn = db.collection("comment");
		
		//连接到ids这个集合下
		var ids = db.collection('ids');
		//串行有关联
		async.waterfall([
			function(callback){
				//查询并更新数据
				ids.findAndModify(
					{name: 'comment'},//查询条件
					[['_id', 'desc']],//排序
					{$inc: {cid: 1}},//给数据库中的cid 自增1
					function(err, results){
						callback(null, results.value.cid);
					}
				)
			}, 
			function(cid, callback){//cid拿到的是results

				//将用户数据整理成数组中json对象准备查询
				var data = [{cid: cid, username: username, title: title, val: val, mydate: mydate}];
				
				//往数据库中插入数据
				conn.insert(data, function(err, results){
					if (err) {
						console.log(err);
						return;
					} else {
						console.log("插入成功");
						
						callback(null, '');
					}
					//关闭数据库
					db.close();
				})
			}
		],function(err, results){
			//跳转到数据列表页
			res.redirect('/list');
		})


		
	}

	//验证是否登录
	if(!username){
		res.send('<script>alert("登录超时，请重新登录。");location.href="/login"</script>');
	}else{
		//链接到数据库
		mongoClient.connect(CONN_DB_STR, function(err, db){
			if (err) {
				console.log(err);
				return;
			} else {
				console.log("Success~");
				//进行数据插入
				insertData(db);
			}
		});
	}
})

//暴露一下方法
module.exports = router;