var zmq = require('zmq');
var _ = require('underscore');

var deadApps = [];
var monitoredProcesses = null;
var aliveProcesses = null;
var monitoredProcessSubscriber = zmq.socket('sub');
var aliveProcessSubscriber = zmq.socket('sub');


var findDeadProcess = function (monitoredProcesses, aliveProcesses) {
	if(monitoredProcesses != null && aliveProcesses != null) {
		console.log("Dead proccesses: \n", deadApps);
		deadApps = [];
		
		_.each(monitoredProcesses, function(app) {
							
			var result = {
				id: app.id,
				pids: app.pids
			};
			deadApps.push(result);
			
			_.each(result.pids, function(pid) {
				if (_.contains(aliveProcesses, pid)) {
					result.pids = _.without(app.pids, pid);
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
	findDeadProcess(monitoredProcesses, aliveProcesses);
	//console.log('Monitored Processes \n', monitoredProcesses);
});

monitoredProcessSubscriber.connect('tcp://localhost:5557');
monitoredProcessSubscriber.subscribe('');

aliveProcessSubscriber.on('message', function(msg) {
	aliveProcesses = JSON.parse(msg.toString());
	findDeadProcess(monitoredProcesses, aliveProcesses);
	//console.log('alive Process ' + aliveProcesses);
});

aliveProcessSubscriber.connect('tcp://localhost:5558');
aliveProcessSubscriber.subscribe('');
