console.clear();

function CountdownTracker(value){
  var el = document.createElement('span');
  el.className = 'flip-clock__piece';
  el.innerHTML = '<b class="flip-clock__card card"><b class="card__top"></b><b class="card__bottom"></b><b class="card__back"><b class="card__bottom"></b></b></b>';
  this.el = el;

  var top = el.querySelector('.card__top'),
      bottom = el.querySelector('.card__bottom'),
      back = el.querySelector('.card__back'),
      backBottom = el.querySelector('.card__back .card__bottom');

  this.update = function(val){
    val = ( '0' + val ).slice(-2);
    if ( val !== this.currentValue ) {
      
      if ( this.currentValue >= 0 ) {
        back.setAttribute('data-value', this.currentValue);
        bottom.setAttribute('data-value', this.currentValue);
      }
      this.currentValue = val;
      top.innerText = this.currentValue;
      backBottom.setAttribute('data-value', this.currentValue);

      this.el.classList.remove('flip');
      void this.el.offsetWidth;
      this.el.classList.add('flip');
    }
  }
  
  this.update(value);
}

function Stopwatch() {
  this.el = document.createElement('div');
  this.el.className = 'flip-clock';
  this.el.id = 'stopwatch-display';

  this.trackers = {};
  this.isRunning = false;
  this.startTime = 0;
  this.elapsedTime = 0;
  this.interval = null;

  // Create trackers for hours, minutes and seconds
  this.trackers['Hours'] = new CountdownTracker(0);
  this.trackers['Minutes'] = new CountdownTracker(0);
  this.trackers['Seconds'] = new CountdownTracker(0);
  
  this.el.appendChild(this.trackers['Hours'].el);
  this.el.appendChild(this.trackers['Minutes'].el);
  this.el.appendChild(this.trackers['Seconds'].el);

  this.updateDisplay = function() {
    var hours = Math.floor(this.elapsedTime / 3600000);
    var minutes = Math.floor((this.elapsedTime % 3600000) / 60000);
    var seconds = Math.floor((this.elapsedTime % 60000) / 1000);
    
    this.trackers['Hours'].update(hours);
    this.trackers['Minutes'].update(minutes);
    this.trackers['Seconds'].update(seconds);
  };

  this.start = function() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startTime = Date.now() - this.elapsedTime;
      this.interval = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
      }, 100);
    }
  };

  this.pause = function() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.interval);
      this.elapsedTime = Date.now() - this.startTime;
    }
  };

  this.stop = function() {
    this.isRunning = false;
    clearInterval(this.interval);
    // Don't reset elapsedTime - keep the final time visible
    this.updateDisplay();
  };

  this.reset = function() {
    this.stop();
    this.elapsedTime = 0;
    this.updateDisplay();
  };

  this.updateDisplay();
}

// Initialize stopwatch
var stopwatch = new Stopwatch();
document.getElementById('stopwatch-display').appendChild(stopwatch.el);

// Button controls
var startBtn = document.getElementById('start-btn');
var pauseBtn = document.getElementById('pause-btn');
var stopBtn = document.getElementById('stop-btn');
var resetBtn = document.getElementById('reset-btn');

startBtn.addEventListener('click', function() {
  stopwatch.start();
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
});

pauseBtn.addEventListener('click', function() {
  stopwatch.pause();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

stopBtn.addEventListener('click', function() {
  stopwatch.stop();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
});

resetBtn.addEventListener('click', function() {
  stopwatch.reset();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
});
