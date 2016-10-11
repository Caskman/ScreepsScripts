var utils = require('utils');
var GenericRole = require('role.generic');
var constants = require('constants');

var WorkerRole = {

    /** @param {Creep} creep **/
    doStuff: function() {
        
        
        if (!this.creep.memory.working && this.atFullEnergy()) {
            this.creep.memory.working = true;
            this.say('working');
        } else if (this.creep.memory.working && this.atEmptyEnergy()) {
            this.creep.memory.working = false;
            this.say('recharging');
        }
        
        if (this.creep.memory.working) {
            if (this.storeEnergy()) {
                this.sayIntermittently('store');
                return;
            } 
            else 
            if (this.buildSomething()) {
                this.sayIntermittently('build');
                return;
            } 
            else 
            if (this.buildWalls()) {
                this.sayIntermittently('build walls');
                return;
            }
            else
            if (this.upgradeSomething() && constants.canWorkersUpgrade) {
                this.sayIntermittently('upgrade');
                return;
            } 
            else {
                this.idle();
                this.sayIntermittently('idle');
                return;
            }
        } else {
            this.recharge()
        }
    }
};

module.exports = utils.extendClass(GenericRole, WorkerRole);