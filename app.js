var express = require('express'),
	app = express(),
	server = app.listen(1337),
	io = require('socket.io').listen(server);


app.use(express.static(__dirname + '/public'));


var contestants = [];

// $scope.range = function(min, max, step) {
//     step = step || 1;
//     var input = [];
//     for (var i = min; i <= max; i += step) {
//         input.push(i);
//     }
//     return input;
// };

io.sockets.on('connection', function(socket) {

	socket.on('listContestants', function(data) {
    socket.emit('onContestantsListed', contestants);
	});

	socket.on('createContestant', function(data) {
    contestants.push(data);
    socket.broadcast.emit('onContestantCreated', data);
	});

	socket.on('updateContestant', function(data){
    contestants.forEach(function(person){
      if (person.id === data.id) {
        person.display_name = data.display_name;
        person.score = data.score;
      }
    });
    socket.broadcast.emit('onContestantUpdated', data);
	});

	socket.on('deleteContestant', function(data){
    contestants = contestants.filter(function(person) {
      return person.id !== data.id;
    });
    socket.broadcast.emit('onContestantDeleted', data);
	});
});

// server.listen(1337);
