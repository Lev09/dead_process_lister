var zmq = require('zmq');
var _ = require('underscore');

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
		findDeadProcess(monitoredProcesses, aliveProcesses);
	}
	else {	
		console.log('monitored process array is empty');
	}
});

monitoredProcessSubscriber.connect('tcp://localhost:5555');
monitoredProcessSubscriber.subscribe('');

aliveProcessSubscriber.on('message', function(msg) {
	aliveProcesses = JSON.parse(msg.toString());
	if(aliveProcesses.length != 0) {
		findDeadProcess(monitoredProcesses, aliveProcesses);
	}
	else {	
		console.log('Alive process array is empty');
	}
});

aliveProcessSubscriber.connect('tcp://localhost:5556');
aliveProcessSubscriber.subscribe('');
