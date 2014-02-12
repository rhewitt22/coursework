// setup ===========================
	var express  = require('express');
	var app      = express();
	var mongoose = require('mongoose');
	var db       = mongoose.connection;

// configuration ===================
	app.configure(function() {
		app.use(express.static(__dirname + '/public'));
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
	});

	var db = mongoose.connection;

	db.on('error', console.error);

	db.once('open', function() {  
		console.log("success");
		var Todo = mongoose.model('Todo', {
			text: String
		});
	});

	mongoose.connect('mongodb://localhost/testee');

// routes ===============================================

	// api ==============================================

	// get all todos
	app.get('/api/todos', function (req, res) {
		
		// use mongoose to get all todos in the database
		Todo.find(function(err, todos) {
			
			// if there is an error, send the error, exit;
			if (err)
				res.send(err)

			// return all todos in JSON format
			res.json(todos);
		});
	});

	// create todo and send back all todos after creation
	app.post('/api/todos', function(req, res) {

		// create a todo, information comes from AJAX request from Angular
		Todo.create({
			text : req.body.text,
			done : false
		}, function(err, todo) {
			if (err)
				res.send(err)

			// get and return all todos after you create a new one
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});

	// delete a todo
	app.delete('/api/todos/:todo_id', function(req, res) {
		Todo.remove({
			_id : req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all todos after you delete one
			Todo.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});
	


// listen on port 8080 =========================================
	app.listen(8080);
	console.log("App listening on port 8080");

// application =================================================
	app.get('*', function(req, res) {

		// load the single view file (angular handles page routing)
		res.sendfile('./public/index.html');
	});
