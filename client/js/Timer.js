
var Timer = function(config) {
    this.init(config);
};

Timer.prototype = {

    timeLimit: 0,
    timerTimeout: null,
    tickInterval: null,
    startTime: 0,
    elapsedTime: 0,

    isRunning: false,

    callbacksContext: null,
    stopCallback: $.noop,
    tickCallback: $.noop,
    startCallback: $.noop,

    init: function(config) {
        // Default time is 10 minutes
        this.timeLimit = config['timeLimit'] || 10 * 60 * 1000;
        this.callbacksContext = config['context'] || this;
        this.stopCallback = config['stopCallback'] || $.noop;
        this.tickCallback = config['tickCallback'] || $.noop;
        this.startCallback = config['startCallback'] || $.noop;

        if(config['startTime']) {
            this.elapsedTime = new Date().getTime() - config['startTime'] * 1000;
        }
    },

    checkAutostart: function() {
        if(!this.elapsedTime) {
            return;
        }

        if(this.elapsedTime > this.timeLimit) {
            this.stopCallback.call(this.callbacksContext);
        } else {
            this.timeLimit -= this.elapsedTime;
            this.start();
        }
    },

    start: function() {
        if(this.isRunning) {
            return;
        }

        this.timerTimeout = setTimeout(_.bind(this.stop, this), this.timeLimit);
        this.startTime = new Date().getTime();
        this.tickInterval = setInterval(_.bind(this.tick, this), 1000);

        this.isRunning = true;

        this.startCallback.call(this.callbacksContext);
    },

    stop: function() {

        if(!this.isRunning) {
            return;
        }

        this._stopTimer();

        this.stopCallback.call(this.callbacksContext);
    },

    tick: function() {
        if(Math.floor(new Date().getTime() - this.startTime) >= this.timeLimit) {
            this.stop();
        }

        this.tickCallback.call(this.callbacksContext);
    },

    getRemainingTime: function() {
        var elapsedTime = Math.floor((new Date().getTime() - this.startTime)/1000);
        var remainingTime = Math.floor(this.timeLimit/1000) - elapsedTime;

        if(remainingTime < 0) {
            return null;
        }

        var remainingMinutes = Math.floor(remainingTime/60);
        var remainingSeconds = remainingTime - remainingMinutes * 60;

        return {
            minutes: remainingMinutes,
            seconds: remainingSeconds
        }
    },

    _stopTimer: function() {
        clearInterval(this.tickInterval);
        clearTimeout(this.timerTimeout);

        this.isRunning = false;
    },

    reset: function() {
        this._stopTimer();
        this.startTime = 0;
        this.elapsedTime = 0;
    }

};