// Exercise data
const exercises = [
  {
    name: "Squats",
    repGoal: "30-100 repetitions",
    minReps: 30,
    maxReps: 100,
    image: "https://via.placeholder.com/200x150/ff6600/white?text=Squats"
  },
  {
    name: "Dand",
    repGoal: "30 repetitions",
    minReps: 30,
    maxReps: 30,
    image: "https://via.placeholder.com/200x150/ff6600/white?text=Dand"
  },
  {
    name: "Hanuman Dand",
    repGoal: "20-30 repetitions",
    minReps: 20,
    maxReps: 30,
    image: "https://via.placeholder.com/200x150/ff6600/white?text=Hanuman+Dand"
  },
  {
    name: "Push-ups",
    repGoal: "20-30 repetitions",
    minReps: 20,
    maxReps: 30,
    image: "https://via.placeholder.com/200x150/ff6600/white?text=Push-ups"
  },
  {
    name: "Rammurti Dand",
    repGoal: "20-30 repetitions",
    minReps: 20,
    maxReps: 30,
    image: "https://via.placeholder.com/200x150/ff6600/white?text=Rammurti+Dand"
  },
  {
    name: "Dumbbell Cut",
    repGoal: "30-40 repetitions",
    minReps: 30,
    maxReps: 40,
    image: "https://via.placeholder.com/200x150/ff6600/white?text=Dumbbell+Cut"
  },
  {
    name: "Hammer Cut",
    repGoal: "30-40 repetitions",
    minReps: 30,
    maxReps: 40,
    image: "https://via.placeholder.com/200x150/ff6600/white?text=Hammer+Cut"
  }
];

// Application state
let appState = {
  isDarkMode: false,
  exercises: exercises.map((exercise, index) => ({
    ...exercise,
    id: index,
    currentReps: 0,
    timerSeconds: 0,
    timerInterval: null,
    isTimerRunning: false
  }))
};

// DOM elements
let workoutGrid;
let themeToggle;
let themeIcon;

// Initialize the application
function init() {
  // Get DOM elements
  workoutGrid = document.getElementById('workoutGrid');
  themeToggle = document.querySelector('.theme-toggle');
  themeIcon = document.querySelector('.theme-icon');
  
  renderExercises();
  setupEventListeners();
}

// Render all exercises
function renderExercises() {
  if (!workoutGrid) return;
  
  workoutGrid.innerHTML = '';
  
  appState.exercises.forEach(exercise => {
    const exerciseCard = createExerciseCard(exercise);
    workoutGrid.appendChild(exerciseCard);
  });
}

// Create individual exercise card
function createExerciseCard(exercise) {
  const card = document.createElement('div');
  card.className = `exercise-card ${getGoalClass(exercise)}`;
  card.dataset.exerciseId = exercise.id;
  
  card.innerHTML = `
    <div class="exercise-image">
      ${exercise.name}
    </div>
    <div class="exercise-content">
      <h3 class="exercise-name">${exercise.name}</h3>
      <p class="exercise-goal">Goal: ${exercise.repGoal}</p>
      
      <div class="rep-section">
        <div class="rep-controls">
          <div class="rep-count">${exercise.currentReps}</div>
          <div class="rep-buttons">
            <button class="count-btn" data-action="increment" data-exercise-id="${exercise.id}">
              Count Rep
            </button>
            <button class="reset-btn" data-action="reset-reps" data-exercise-id="${exercise.id}">
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div class="timer-section">
        <div class="timer-display">${formatTime(exercise.timerSeconds)}</div>
        <div class="timer-controls">
          <button class="timer-btn timer-btn--start" data-action="start-timer" data-exercise-id="${exercise.id}">
            ${exercise.isTimerRunning ? 'Pause' : 'Start'}
          </button>
          <button class="timer-btn timer-btn--reset" data-action="reset-timer" data-exercise-id="${exercise.id}">
            Reset
          </button>
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// Get goal achievement class
function getGoalClass(exercise) {
  if (exercise.currentReps >= exercise.maxReps) {
    return 'goal-complete';
  } else if (exercise.currentReps >= exercise.minReps) {
    return 'goal-reached';
  }
  return '';
}

// Format time for display (MM:SS)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Setup event listeners
function setupEventListeners() {
  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Exercise interactions (using event delegation)
  if (workoutGrid) {
    workoutGrid.addEventListener('click', handleExerciseInteraction);
  }
}

// Toggle theme
function toggleTheme() {
  appState.isDarkMode = !appState.isDarkMode;
  
  // Update the data attribute on the document element
  document.documentElement.setAttribute('data-theme', appState.isDarkMode ? 'dark' : 'light');
  
  // Update theme icon
  if (themeIcon) {
    themeIcon.textContent = appState.isDarkMode ? '☀️' : '🌙';
  }
}

// Handle exercise interactions
function handleExerciseInteraction(event) {
  const target = event.target;
  const action = target.dataset.action;
  const exerciseIdStr = target.dataset.exerciseId;
  
  if (!action || !exerciseIdStr) return;
  
  const exerciseId = parseInt(exerciseIdStr);
  const exercise = appState.exercises[exerciseId];
  
  if (!exercise) return;
  
  switch (action) {
    case 'increment':
      incrementReps(exerciseId);
      break;
    case 'reset-reps':
      resetReps(exerciseId);
      break;
    case 'start-timer':
      toggleTimer(exerciseId);
      break;
    case 'reset-timer':
      resetTimer(exerciseId);
      break;
  }
}

// Increment reps for an exercise
function incrementReps(exerciseId) {
  const exercise = appState.exercises[exerciseId];
  if (!exercise) return;
  
  const previousReps = exercise.currentReps;
  exercise.currentReps++;
  
  // Update the specific card
  updateExerciseCard(exerciseId);
  
  // Check for goal achievement
  if (previousReps < exercise.minReps && exercise.currentReps >= exercise.minReps) {
    showGoalAchievement(exerciseId, 'Goal reached!');
  } else if (previousReps < exercise.maxReps && exercise.currentReps >= exercise.maxReps) {
    showGoalAchievement(exerciseId, 'Goal complete!');
  }
}

// Reset reps for an exercise
function resetReps(exerciseId) {
  const exercise = appState.exercises[exerciseId];
  if (!exercise) return;
  
  exercise.currentReps = 0;
  updateExerciseCard(exerciseId);
}

// Toggle timer for an exercise
function toggleTimer(exerciseId) {
  const exercise = appState.exercises[exerciseId];
  if (!exercise) return;
  
  if (exercise.isTimerRunning) {
    // Pause timer
    if (exercise.timerInterval) {
      clearInterval(exercise.timerInterval);
      exercise.timerInterval = null;
    }
    exercise.isTimerRunning = false;
  } else {
    // Start timer
    exercise.timerInterval = setInterval(() => {
      exercise.timerSeconds++;
      updateTimerDisplay(exerciseId);
    }, 1000);
    exercise.isTimerRunning = true;
  }
  
  updateTimerControls(exerciseId);
}

// Reset timer for an exercise
function resetTimer(exerciseId) {
  const exercise = appState.exercises[exerciseId];
  if (!exercise) return;
  
  // Clear interval if running
  if (exercise.timerInterval) {
    clearInterval(exercise.timerInterval);
    exercise.timerInterval = null;
  }
  
  exercise.timerSeconds = 0;
  exercise.isTimerRunning = false;
  
  updateExerciseCard(exerciseId);
}

// Update specific exercise card
function updateExerciseCard(exerciseId) {
  const card = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
  if (!card) return;
  
  const exercise = appState.exercises[exerciseId];
  if (!exercise) return;
  
  // Update rep count
  const repCount = card.querySelector('.rep-count');
  if (repCount) {
    repCount.textContent = exercise.currentReps;
  }
  
  // Update timer display
  updateTimerDisplay(exerciseId);
  
  // Update timer controls
  updateTimerControls(exerciseId);
  
  // Update card class for goal achievement
  card.className = `exercise-card ${getGoalClass(exercise)}`;
}

// Update timer display
function updateTimerDisplay(exerciseId) {
  const card = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
  if (!card) return;
  
  const exercise = appState.exercises[exerciseId];
  if (!exercise) return;
  
  const timerDisplay = card.querySelector('.timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(exercise.timerSeconds);
  }
}

// Update timer controls
function updateTimerControls(exerciseId) {
  const card = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
  if (!card) return;
  
  const exercise = appState.exercises[exerciseId];
  if (!exercise) return;
  
  const startButton = card.querySelector('[data-action="start-timer"]');
  
  if (startButton) {
    startButton.textContent = exercise.isTimerRunning ? 'Pause' : 'Start';
    startButton.className = `timer-btn ${exercise.isTimerRunning ? 'timer-btn--pause' : 'timer-btn--start'}`;
  }
}

// Show goal achievement feedback
function showGoalAchievement(exerciseId, message) {
  const card = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
  if (!card) return;
  
  // Add visual feedback through CSS animation
  card.style.animation = 'goalAchieved 0.5s ease-in-out';
  
  // Remove animation after it completes
  setTimeout(() => {
    card.style.animation = '';
  }, 500);
  
  // Optional: Show a brief message (you could enhance this with a toast notification)
  console.log(`${appState.exercises[exerciseId].name}: ${message}`);
}

// Cleanup function to clear all intervals when page unloads
function cleanup() {
  appState.exercises.forEach(exercise => {
    if (exercise.timerInterval) {
      clearInterval(exercise.timerInterval);
    }
  });
}

// Event listeners for cleanup
window.addEventListener('beforeunload', cleanup);
window.addEventListener('unload', cleanup);

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already loaded
  init();
}