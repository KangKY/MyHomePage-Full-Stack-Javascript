var express = require('express');
var app = require('./config/express')(express);
var conn = require('./config/mysql')();


app.use(express.static('assets'));

// 관리자 로그인 관련
var auth = require('./routes/mysql/auth')(conn);
app.use('/auth/', auth);

// 업로드 관련
var portfolio = require('./routes/mysql/portfolio')(conn);
app.use('/portfolio/', portfolio);

/////////////////////////////////////////////////////////////

app.get('/', function(req, res){
    // sql 질의문 수정 필요 포트폴리오 정보 모두 가져오기
    var sql = 'SELECT * FROM projects_info';
        conn.query(sql,1, function(err, topic, fields){
             if(err)
             {
                 console.log(err);
                 res.status(500).send('Internal Server Error');
             }
            res.render('index', {data : topic});
            //res.send(topic);
        });
});

app.all('/:route',function(req,res){
    var route = req.params.route;
    res.render(route);
});

/////////////////////////////////////////////////////////////

app.listen(4000, function(){
   console.log("Connected on port 4000!")
});
