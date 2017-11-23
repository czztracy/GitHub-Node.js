var express = require('express');
var router = express.Router();
var async = require("async");
var mongodb = require('mongodb');
//引入数据库
var mongodb = require("mongodb");
//生成客户端
var mongoClient = mongodb.MongoClient;
//创建数据库连接地址
var CONN_DB_STR = 'mongodb://localhost:27017/NBA';

/* GET home page. */
//主页
router.get('/', function(req, res, next) {
  res.render('index', { title: 'JD' , username: req.session.username});
});
//注册页面
router.get('/register', function(req, res, next){
	res.render('register', {});
})
//登录页面
router.get('/login', function(req, res, next){
	res.render('login', {});
})
//注销操作
router.get('/logout', function(req, res, next){
	req.session.username = undefined;
	res.redirect('/');
})
//评论页面
router.get('/comment', function(req, res, next){
	res.render('comment', {});
})
//评论列表页
router.get('/list', function(req, res, next){
	var pageNo = parseInt(req.query['pageNo']) || 1;//当前在第几页
	var pageSize = 5;//每页显示5条数据
	var totalPage = 0;//总共多少页
	var count = 0; //总共多少条数据 

	function findData(db){
		var conn = db.collection("comment");
		//串行无关联
		async.series([
			function(callback){
				//查出所有数据
				conn.find().toArray(function(err, results){
					count = results.length;
					totalPage = Math.ceil(count/5);
					//保证地址栏中pageNo在totalPage范围内
					//在当前页数下 若当前页数大于总页数时 为总页数totalPage 否则为当前页数pageNo
					pageNo = pageNo > totalPage ? totalPage : pageNo;

					pageNo = pageNo < 1 ? 1 : pageNo;

					callback(null, '');
				})
			},
			function(callback){
				//倒叙查询 最新的一条在最上边 skip 从第几条开始查询,limit显示多少条数据
				conn.find({}).sort({_id:-1}).skip((pageNo-1)*pageSize).limit(pageSize).toArray(function(err, results){
					console.log(results);
					callback(null, results);
				})
			}
		],function(err, results){
			if(err){
				console.log(err);
				return;
			} else{
				res.render('list', {
					resData: results[1],
					count: count,
					totalPage: totalPage,
					pageNo: pageNo
				})
				console.log(results);
			}
		})
	}

	//连接到数据库
	mongoClient.connect(CONN_DB_STR, function(err, db){
		if (err) {
			console.log(err);
			return;
		} else {
			console.log("连接成功");
			//查询数据库
			findData(db);
		}
	})
})
//用户详情页
router.get('/detail', function(req, res, next){
	//int类型懂get请求发送的时候会类型转换
	var cid = parseInt(req.query['cid']);

	mongoClient.connect(CONN_DB_STR, function(err, db){
		if (err) {
			console.log(err);
			return;
		} else {
			db.collection('comment').findOne({cid : cid}, 
			function(err, item){
				if(err){
					console.log(err);
					return;
				}else{
					console.log(item);
					
					res.render('detail', {item: item});
				}
			});
		}
	})
})

module.exports = router;
