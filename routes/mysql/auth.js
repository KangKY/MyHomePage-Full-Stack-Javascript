module.exports = function(conn) {
    var route = require('express').Router();
    // 암호화 관련
    var pbkdf2Password = require("pbkdf2-password");
    var hasher = pbkdf2Password();

    route.get('/', function(req,res){
        //res.send('hi');
        res.render('auth');
        if(req.session.admin_id)
        {
          res.redirect('portfolio');
        }
        else
        {
          res.render('auth/login');
          //res.send("hi");
        }

    });

    route.get('/login', function(req,res){
        //res.send('hi');
        res.render('auth/login');
    });

    route.get('/register', function(req, res){
       res.render('auth/register');
    });

    route.get('/logout', function(req, res){
        delete req.session.admin_id;

        // db 연산 속도와 redirection 속도의 차이로 인해 의도치 않은 결과 생성 가능성 있음
        // save 함수를 통해 연산이 끝난 후 콜백으로 리다이렉션 호출
        req.session.save(function(){
            res.redirect('/auth/login');
        });

    });

    /* ------ POST method ------*/

    route.post('/login', function(req,res){
        if(req.body.admin_id && req.body.password){
            var id = req.body.admin_id;
            var pwd = req.body.password;

            var sql = 'SELECT * FROM admin WHERE admin_id=?';
            conn.query(sql,id, function(err, admin, fields){
                if(err)
                {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }

            return hasher({salt:admin[0].salt, password:pwd}, function(err, pass, salt, hash){
                    if(hash === admin[0].password) {
                        req.session.admin_id = admin.admin_id;

                        req.session.save(function(){
                            res.redirect('/upload/');
                        });
                    }
                    else {
                        res.send('Who are you?');
                    }
                });
            });
        }
        else
            res.send("Please fill out your information!")
    });


    route.post('/register', function(req, res){
        if(req.body.admin_id && req.body.password){
            hasher({password:req.body.password},function(err, pass, salt, hash){

                var administer = {
                    admin_id: req.body.admin_id,
                    password: hash,
                    salt: salt
                };
                var sql = 'INSERT INTO admin SET ?';
                conn.query(sql, administer, function(err, results){
                    if(err){
                        console.log(err);
                        res.status(500);
                    }
                    else{
                        res.redirect('/auth');
                    }
                });
            });
        }
        else{
            res.send("Please fill out your information!")
        }
    });

    return route;
}
