// Audio service for playing sound effects
let trainSound: HTMLAudioElement | null = null;

const loadSound = () => {
  if (!trainSound) {
    trainSound = new Audio('/sounds/train.mp3');
    // Pre-load the audio
    trainSound.load();
  }
};

// Call this when the component mounts
export const initializeAudio = () => {
  loadSound();
};

export const playTrainSound = async () => {
  try {
    if (!trainSound) {
      loadSound();
    }
    
    if (trainSound) {
      trainSound.currentTime = 0; // Reset the audio to start
      const playPromise = trainSound.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('Train sound played successfully');
      }
    }
  } catch (error) {
    console.error('Error playing train sound:', error);
  }
}; 