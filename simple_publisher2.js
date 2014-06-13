var zmq = require('zmq');
var publisher = zmq.socket('pub');

var aliveProcesses = ["1523", "4722", "566", "536", "4229", "1243"];

publisher.bind('tcp://*:5558', function(error) {
	if(error) {
		console.log(error);
	}
	else {
		console.log('Binding on port 5558');
	}
});

setInterval(function() {
	publisher.send(JSON.stringify(aliveProcesses));
},1000);
