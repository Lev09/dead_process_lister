var zmq = require('zmq');
var publisher = zmq.socket('pub');

var monitoredProcesses = [
	{id: "1a", pids: ["1523","4722","566"]},
	{id: "23c", pids: ["1623","4822","536"]},
	{id: "1g", pids: ["1233","4229","526"]},
	{id: "5a", pids: ["1243","42","516"]}
];

publisher.bind('tcp://*:5557', function(error) {
	if(error) {
		console.log(error);
	}
	else {
		console.log('Binding on port 5557');
	}
});

setInterval(function() {
	publisher.send(JSON.stringify(monitoredProcesses));
},1000);
