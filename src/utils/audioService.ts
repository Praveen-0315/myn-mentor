// Audio context instance
let audioContext: AudioContext | null = null;

// Initialize audio context
export const initializeAudio = () => {
  try {
    // Create AudioContext only on user interaction to comply with browser policies
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return true;
  } catch (error) {
    console.error('Failed to initialize audio context:', error);
    return false;
  }
};

// Play a simple training completion sound
export const playTrainSound = async () => {
  try {
    if (!audioContext) {
      if (!initializeAudio()) {
        return;
      }
    }

    // Create an oscillator for a pleasant notification sound
    const oscillator = audioContext!.createOscillator();
    const gainNode = audioContext!.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext!.destination);

    // Configure sound
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(587.33, audioContext!.currentTime); // D5
    gainNode.gain.setValueAtTime(0, audioContext!.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext!.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext!.currentTime + 0.5);

    // Play sound
    oscillator.start(audioContext!.currentTime);
    oscillator.stop(audioContext!.currentTime + 0.5);

  } catch (error) {
    console.error('Failed to play training sound:', error);
  }
};

// Clean up audio context when needed
export const cleanupAudio = () => {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}; 