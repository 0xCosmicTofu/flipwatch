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

function Timer() {
  this.el = document.createElement('div');
  this.el.className = 'flip-clock';
  this.el.id = 'timer-display';

  this.trackers = {};
  this.isRunning = false;
  this.startTime = 0;
  this.totalTime = 0;
  this.remainingTime = 0;
  this.interval = null;

  // Create trackers for hours, minutes and seconds
  this.trackers['Hours'] = new CountdownTracker(0);
  this.trackers['Minutes'] = new CountdownTracker(0);
  this.trackers['Seconds'] = new CountdownTracker(0);
  
  this.el.appendChild(this.trackers['Hours'].el);
  this.el.appendChild(this.trackers['Minutes'].el);
  this.el.appendChild(this.trackers['Seconds'].el);

  this.updateDisplay = function() {
    var hours = Math.floor(this.remainingTime / 3600000);
    var minutes = Math.floor((this.remainingTime % 3600000) / 60000);
    var seconds = Math.floor((this.remainingTime % 60000) / 1000);
    
    this.trackers['Hours'].update(hours);
    this.trackers['Minutes'].update(minutes);
    this.trackers['Seconds'].update(seconds);
  };

  this.setTime = function(hours, minutes, seconds) {
    this.totalTime = (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
    this.remainingTime = this.totalTime;
    this.updateDisplay();
  };

  this.start = function() {
    if (!this.isRunning && this.remainingTime > 0) {
      this.isRunning = true;
      this.startTime = Date.now() - (this.totalTime - this.remainingTime);
      this.interval = setInterval(() => {
        this.remainingTime = this.totalTime - (Date.now() - this.startTime);
        if (this.remainingTime <= 0) {
          this.remainingTime = 0;
          this.stop();
          showModal('Timer complete!');
        }
        this.updateDisplay();
      }, 100);
    }
  };

  this.pause = function() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.interval);
    }
  };

  this.stop = function() {
    this.isRunning = false;
    clearInterval(this.interval);
    this.remainingTime = this.totalTime;
    this.updateDisplay();
  };

  this.reset = function() {
    this.stop();
    this.remainingTime = this.totalTime;
    this.updateDisplay();
  };

  this.updateDisplay();
}

// Initialize stopwatch and timer
var stopwatch = new Stopwatch();
var timer = new Timer();

document.getElementById('stopwatch-container').appendChild(stopwatch.el);
document.getElementById('timer-container').appendChild(timer.el);

// Ensure timer inputs are hidden on page load (handled by CSS)

// Custom Modal Function
function showModal(message) {
  // Create modal overlay
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Create modal content
  var modal = document.createElement('div');
  modal.className = 'modal';
  
  // Add message
  var heading = document.createElement('h3');
  heading.textContent = message;
  modal.appendChild(heading);
  
  // Add OK button
  var button = document.createElement('button');
  button.textContent = 'OK';
  button.onclick = function() {
    document.body.removeChild(overlay);
  };
  modal.appendChild(button);
  
  // Add modal to overlay and show
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// Tab switching
var stopwatchTab = document.getElementById('stopwatch-tab');
var timerTab = document.getElementById('timer-tab');
var stopwatchContainer = document.getElementById('stopwatch-container');
var timerContainer = document.getElementById('timer-container');

stopwatchTab.addEventListener('click', function() {
  stopwatchTab.classList.add('active');
  timerTab.classList.remove('active');
  stopwatchContainer.classList.add('active');
  timerContainer.classList.remove('active');
  // Show reset button in stopwatch mode
  resetBtn.style.display = 'inline-block';
});

timerTab.addEventListener('click', function() {
  timerTab.classList.add('active');
  stopwatchTab.classList.remove('active');
  timerContainer.classList.add('active');
  stopwatchContainer.classList.remove('active');
  // Hide reset button in timer mode
  resetBtn.style.display = 'none';
});

// Unified action buttons (work for both stopwatch and timer)
var startBtn = document.getElementById('start-btn');
var pauseBtn = document.getElementById('pause-btn');
var stopBtn = document.getElementById('stop-btn');
var resetBtn = document.getElementById('reset-btn');

// Timer input fields
var hoursInput = document.getElementById('hours-input');
var minutesInput = document.getElementById('minutes-input');
var secondsInput = document.getElementById('seconds-input');

// Input validation and behavior
function setupInputValidation() {
  [hoursInput, minutesInput, secondsInput].forEach(input => {
    input.addEventListener('input', function() {
      var value = parseInt(this.value) || 0;
      var max = parseInt(this.max);
      
      if (value > max) {
        this.value = max;
      }
      
      // Remove placeholder when user starts typing
      if (this.value !== '') {
        this.placeholder = '';
      } else {
        this.placeholder = '0';
      }
      
      // Update flip display in real-time
      updateTimerDisplay();
    });
    
    input.addEventListener('blur', function() {
      if (this.value === '') {
        this.placeholder = '0';
      }
      // Update flip display when input loses focus
      updateTimerDisplay();
    });
  });
}

// Function to update timer display based on input values
function updateTimerDisplay() {
  var hours = parseInt(hoursInput.value) || 0;
  var minutes = parseInt(minutesInput.value) || 0;
  var seconds = parseInt(secondsInput.value) || 0;
  
  // Update the timer display without starting the countdown
  timer.setTime(hours, minutes, seconds);
}

setupInputValidation();

// Timer reset button functionality
var timerResetBtn = document.getElementById('timer-reset-btn');
timerResetBtn.addEventListener('click', function() {
  // Clear all timer input fields
  hoursInput.value = '';
  minutesInput.value = '';
  secondsInput.value = '';
  
  // Reset placeholders
  hoursInput.placeholder = '0';
  minutesInput.placeholder = '0';
  secondsInput.placeholder = '0';
  
  // Update display to show 00:00:00
  updateTimerDisplay();
});

// Unified action button handlers
startBtn.addEventListener('click', function() {
  if (stopwatchContainer.classList.contains('active')) {
    // Stopwatch mode
    stopwatch.start();
  } else {
    // Timer mode
    var hours = parseInt(hoursInput.value) || 0;
    var minutes = parseInt(minutesInput.value) || 0;
    var seconds = parseInt(secondsInput.value) || 0;
    
    if (hours === 0 && minutes === 0 && seconds === 0) {
      showModal('Please set a time greater than 0');
      return;
    }
    
    timer.setTime(hours, minutes, seconds);
    timer.start();
  }
  
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
});

pauseBtn.addEventListener('click', function() {
  if (stopwatchContainer.classList.contains('active')) {
    stopwatch.pause();
  } else {
    timer.pause();
  }
  
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

stopBtn.addEventListener('click', function() {
  if (stopwatchContainer.classList.contains('active')) {
    stopwatch.stop();
  } else {
    timer.stop();
  }
  
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
});

resetBtn.addEventListener('click', function() {
  if (stopwatchContainer.classList.contains('active')) {
    stopwatch.reset();
  } else {
    timer.reset();
  }
  
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  stopBtn.disabled = true;
});
