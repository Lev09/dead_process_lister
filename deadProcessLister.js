var zmq = require('zmq');
var _ = require('underscore');
var argv = require('optimist')
.default({
	bind: 'tcp://*:5557',
	connectMPLister: 'tcp://localhost:8688',
	connectAPLister: 'tcp://localhost:5556'
}).argv;

var deadApps = [];
var monitoredProcesses = null;
var aliveProcesses = null;
var monitoredProcessSubscriber = zmq.socket('sub');
var aliveProcessSubscriber = zmq.socket('sub');


var findDeadProcess = function (monitoredProcesses, aliveProcesses) {
	if(monitoredProcesses != null && aliveProcesses != null) {
		deadApps = [];
	
		_.each(monitoredProcesses, function(app) {		
			var result = {
				id: app.id,
				pids: []
			};
			deadApps.push(result);
		
			_.each(app.pids, function(pid) {
				if (!_.contains(aliveProcesses, pid)) {
					result.pids.push(pid);
				}
			});
		
		});
	}
	else {
		console.log("WARNING: inported only one array for comparing");
	}
};

monitoredProcessSubscriber.on('message', function(msg) {
	monitoredProcesses = JSON.parse(msg.toString());
	if(monitoredProcesses.length != 0) {
		if(deadApps.length !== 0) {
			publisher.send(JSON.stringify(deadApps));
		}
		findDeadProcess(monitoredProcesses, aliveProcesses);
	}
	else {	
		console.log('monitored process array is empty');
	}
});

monitoredProcessSubscriber.connect(argv.connectMPLister);
monitoredProcessSubscriber.subscribe('');
console.log('Listening on ' + argv.connectMPLister);

aliveProcessSubscriber.on('message', function(msg) {
	aliveProcesses = JSON.parse(msg.toString());
	if(aliveProcesses.length != 0) {
		if(deadApps.length !== 0) {
			publisher.send(JSON.stringify(deadApps));
		}
		findDeadProcess(monitoredProcesses, aliveProcesses);
	}
	else {	
		console.log('Alive process array is empty');
	}
});

aliveProcessSubscriber.connect(argv.connectAPLister);
aliveProcessSubscriber.subscribe('');
console.log('Listening on ' + argv.connectAPLister);

var publisher = zmq.socket('pub');
publisher.bind(argv.bind, function(error) {
	if(error) {
		console.log(error);
	}
	else {
		console.log('binding on ' + argv.bind);
	}
});
