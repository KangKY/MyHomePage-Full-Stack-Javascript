module.exports = function(conn) {
    var route = require('express').Router();
    var multer = require('multer');

    // 업로드 관련
    var _storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'assets/upload')
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname)
      }
    });
    var upload = multer({storage : _storage});

    route.get('/', function(req, res){
        res.render('portfolio');
        /*var sql = 'SELECT * FROM admin';
        conn.query(sql, function(err, results, fields){
            if(err)
            {
                res.status(500).send('Internal Server Error');
                console.log(err);
            }
            else
                res.render('upload', {portfolios : results});
        });*/
    });

    // upload.single('avatar')
    // =사용자가 전송한 데이터에 파일이 포함되있다면 가공해서 req객체에 파일 추가
    route.post('/', upload.single('thumbnail'), function(req, res){
        
       // res.send(req.body);
         
        //console.log(req.body);
        

      
        var title = req.body.title;
        var category = req.body.category;
        
        var src = req.file.destination.split('/');
        var source = src[1]+"/"+req.file.originalname;
        
        var description = req.body.description;
        var skills = req.body.skills;
        var start_date = req.body.start_date;
        var end_date = req.body.end_date;


        var params = [title, category, source, skills, description, start_date, end_date];
        //console.log(params);
        var sql = 'INSERT INTO projects_info(title, category,thumbnail_src, skills, description,  start_date, end_date) VALUES(?, ?, ?, ?, ?, ?, ?)';
        conn.query(sql, params, function(err, results, fields){
            if(err)
            {
                 console.log(err);
                res.status(500).send('Internal Server Error');
               
            }

            else{
                //res.send("Good Job");
                res.render('portfolio');
            }
        });
    });

    /*route.get('/upload', function(req, res){
        var sql = 'SELECT * FROM admin';
        conn.query(sql, function(err, results, fields){
            if(err)
            {
                res.status(500).send('Internal Server Error');
                console.log(err);
            }
            else
                res.render('upload', {portfolios : results});
        });


    });
    // upload.single('avatar')
    // =사용자가 전송한 데이터에 파일이 포함되있다면 가공해서 req객체에 파일 추가
    route.post('/upload', upload.single('userfile'), function(req, res){
        //console.log(req);
       res.send('Uploaded : '+req.file.originalname);
    });


    // ADD
    route.get('/add', function(req,res){
        res.render('add');
    });
    route.post('/add', function(req, res){

        var title = req.body.title;
        var description = req.body.description;
        var author = req.body.author;
        var params = [title, description, author];
        var sql = 'INSERT INTO projects_info(title, description_short, description_long, start_date, end_date) VALUES(?, ?, ?,?,?)';

        //var sql = 'SELECT * FROM audit_log';
        conn.query(sql, params, function(err, results, fields){
            if(err)
            {
                res.status(500).send('Internal Server Error');
                console.log(err);
            }

            else{
                res.redirect('/portfolio/'+results.insertId);
            }
        });

    });

    //

    // EDIT
    route.get('/:id/edit', function(req,res){

        var sql = 'SELECT * FROM projects_info';
        var id = req.params.id;
        conn.query(sql, function(err, topics, fields){
            if(err)
            {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }

            else{
                    if(id)
                    {
                        var sql = 'SELECT * FROM projects_info WHERE id=?';
                        conn.query(sql,id, function(err, topic, fields){
                             if(err)
                             {
                                 console.log(err);
                                 res.status(500).send('Internal Server Error');
                             }

                             res.render('edit', {topics: topics, topic: topic[0]});
                        });
                    }
                    else
                    {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    }
            }
        });
    });
    route.post('/:id/edit', function(req,res){
        var id = req.params.id;
        var sql = 'UPDATE projects_info SET title=?, author= ?, description= ? WHERE id=?';
        var param = [req.body.title, req.body.author, req.body.description,id ];
        conn.query(sql,param, function(err, results, fields){
            if(err)
            {
             console.log(err);
             res.status(500).send('Internal Server Error');
            }
            else
               res.redirect('/portfolio/'+id);
                // res.redirect('/topic/'+results.insertId);
        });
    });
    //

    // DELETE
    route.get('/:id/delete', function(req,res){

        var sql = 'SELECT * FROM projects_info';
        var id = req.params.id;
        conn.query(sql, function(err, topics, fields){
            if(err)
            {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }

            else{
                    if(id)
                    {
                        var sql = 'SELECT * FROM projects_info WHERE id=?';
                        conn.query(sql,id, function(err, topic, fields){
                             if(err)
                             {
                                 console.log(err);
                                 res.status(500).send('Internal Server Error');
                             }
                             else{
                                 if(topic.length===0){
                                     console.log(err);
                                    res.status(500).send('Internal Server Error');
                                 }
                                 else{
                                     res.render('delete', {topics: topics, topic: topic[0]});
                                 }
                             }
                        });
                    }
                    else
                    {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    }
            }
        });
    });

    route.post('/:id/delete', function(req,res){
        //res.send(req.body.yes);
        var id = req.params.id;
        if(req.body.yes){

            var sql = 'DELETE FROM projects_info WHERE id=?';
            var param = [id];
            conn.query(sql,param, function(err, results, fields){
                if(err)
                {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else
                    res.redirect('/portfolio/');
                    // res.redirect('/topic/'+results.insertId);
            });
        }
        else
            res.redirect('/portfolio/'+id);

    });
    //


    // Main
    /*route.get(['/', '/:id'], function(req, res){
        var sql = 'SELECT * FROM topic';
        var id = req.params.id;

        conn.query(sql, function(err, topics, fields){
            if(err)
            {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }

            else{
                    if(id)
                    {
                        var sql = 'SELECT * FROM topic WHERE id=?';
                        conn.query(sql,id, function(err, topic, fields){
                             if(err)
                             {
                                 console.log(err);
                                 res.status(500).send('Internal Server Error');
                             }

                             res.render('view', {topics: topics, topic: topic[0]});
                        });
                    }
                    else
                    {
                        res.render('view', {topics: topics});
                    }
            }
        });
    });*/




    return route;
}
