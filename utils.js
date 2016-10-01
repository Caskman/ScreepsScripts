var specs = require('specs');
var constants = require("constants");
var jobs = require('jobs');

var utils = {
    extend: function(obj, props) {
        for(var prop in props) {
            if(props.hasOwnProperty(prop)) {
                obj[prop] = props[prop];
            }
        }
    },
    extendClass: function(superclass, subclass) {
        var newclass = Object.create(superclass);
        this.extend(newclass, subclass);
        return newclass;
    },
    cleanCreepMemory: function() {
        var keys = Object.keys(Memory.creeps);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (!Game.creeps[key]) {
                delete Memory.creeps[key];
            }
        }
    },
    getCreepCounts: function() {
        return _.groupBy(Game.creeps, c => c.memory.role);
    },
    getJob: function(jobId) {
        return this.jobs[jobId];
    },
    getGameObj: function(id) {
        return Game.getObjectById(id);
    },
    specs: specs,
    jobs: jobs,
};

module.exports = utils;