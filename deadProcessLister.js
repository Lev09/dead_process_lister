var _ = require('underscore');

var apps = [
	{id: "1a", pids: ["1523","4722","566"]},
	{id: "23c", pids: ["1623","4822","536"]},
	{id: "1g", pids: ["1233","4229","526"]},
	{id: "5a", pids: ["1243","42","516"]}
];

var aliveProcesses = ["1523", "4722", "566", "536", "4229", "1243"];
console.log(aliveProcesses);

findDeadProcess = function (apps, aliveProcesses) {
	_.each(apps, function(app) {
		_.each(app.pids, function(pid) {
			if (_.contains(aliveProcesses, pid)) {
				app.pids = _.without(app.pids, pid);
			}
		});
	});
};

findDeadProcess(apps, aliveProcesses);

setTimeout(function() {
	console.log(apps);
}, 5000);
