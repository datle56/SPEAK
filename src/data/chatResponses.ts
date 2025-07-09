export interface ChatResponse {
  trigger: string[];
  responses: string[];
  category: 'pronunciation' | 'conversation' | 'grammar' | 'general';
}

export const chatResponses: ChatResponse[] = [
  {
    trigger: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    responses: [
      "Hello! I'm excited to help you practice English pronunciation today. What would you like to work on?",
      "Hi there! Ready for some pronunciation practice? I'm here to help you improve your speaking skills.",
      "Hey! Great to see you here. Let's make your English pronunciation even better today!"
    ],
    category: 'general'
  },
  {
    trigger: ['pronunciation', 'pronounce', 'how to say', 'speak'],
    responses: [
      "Great! Let's work on pronunciation. Try saying the word slowly and focus on each syllable. Remember to use your tongue, lips, and breath correctly.",
      "Pronunciation is all about practice! Start with the mouth position for each sound. Would you like to try a specific word or phrase?",
      "Perfect! For better pronunciation, focus on: 1) Stress patterns, 2) Vowel sounds, 3) Consonant clarity. What word shall we practice?"
    ],
    category: 'pronunciation'
  },
  {
    trigger: ['conversation', 'talk', 'chat', 'dialogue'],
    responses: [
      "Excellent! Let's have a conversation. I'll help you with pronunciation as we talk. How was your day?",
      "I love conversation practice! It's the best way to improve. Tell me about your hobbies, and I'll help with your pronunciation.",
      "Great idea! Conversational practice is key to fluent speaking. What topic interests you most?"
    ],
    category: 'conversation'
  },
  {
    trigger: ['difficult', 'hard', 'struggle', 'problem'],
    responses: [
      "Don't worry! Everyone finds some sounds challenging. The key is consistent practice. Which specific sound is giving you trouble?",
      "That's completely normal! English pronunciation can be tricky. Let's break it down step by step. What's the challenging word?",
      "I understand it can be frustrating. Remember, even native speakers had to learn these sounds as children. You're doing great!"
    ],
    category: 'pronunciation'
  },
  {
    trigger: ['thank you', 'thanks', 'appreciate'],
    responses: [
      "You're very welcome! I'm here to help you succeed. Keep practicing - you're making great progress!",
      "My pleasure! Remember, consistent practice is the key to improvement. You're doing wonderfully!",
      "Happy to help! Your dedication to improving your pronunciation is admirable. Keep up the excellent work!"
    ],
    category: 'general'
  },
  {
    trigger: ['vowel', 'vowels', 'a e i o u'],
    responses: [
      "Vowels are crucial for clear pronunciation! English has about 20 vowel sounds. Let's practice: /æ/ as in 'cat', /ɪ/ as in 'bit', /ʊ/ as in 'book'. Try these!",
      "Great question! Vowel sounds are the foundation of clear speech. Remember: your mouth shape changes for each vowel. Which vowel sound would you like to practice?",
      "Vowels carry the melody of English! Focus on mouth position: open for /ɑ/ (father), closed for /i/ (see). Let's practice some vowel pairs!"
    ],
    category: 'pronunciation'
  },
  {
    trigger: ['consonant', 'consonants', 'th', 'r', 'l'],
    responses: [
      "Consonants give English its rhythm! The 'th' sound is made by putting your tongue between your teeth. Try 'think' and 'this' - feel the difference?",
      "Consonant sounds can be tricky! For 'r', curl your tongue back slightly. For 'l', touch your tongue to the roof of your mouth. Let's practice!",
      "Excellent focus on consonants! They're like the skeleton of words. Which consonant sound would you like to work on specifically?"
    ],
    category: 'pronunciation'
  },
  {
    trigger: ['stress', 'emphasis', 'accent'],
    responses: [
      "Word stress is so important! In 'pronunciation' the stress is on 'nun': pro-nun-ci-A-tion. Try emphasizing the stressed syllable more.",
      "Great question about stress! English is a stress-timed language. Strong syllables are longer and louder. Weak syllables are shorter. Let's practice!",
      "Stress patterns make English sound natural! Remember: content words (nouns, verbs) are usually stressed, function words (the, and, of) are usually unstressed."
    ],
    category: 'pronunciation'
  }
];

export const getAIResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // Find matching response category
  for (const responseGroup of chatResponses) {
    if (responseGroup.trigger.some(trigger => message.includes(trigger))) {
      const responses = responseGroup.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Default responses if no match found
  const defaultResponses = [
    "That's interesting! Let's practice pronunciation with that topic. Can you say a sentence about it?",
    "I'd love to help you with that! Try speaking about it, and I'll give you pronunciation feedback.",
    "Great topic for practice! Remember to speak clearly and don't rush. What would you like to say about it?",
    "Perfect! Let's use that for pronunciation practice. Speak slowly and focus on clear articulation.",
    "Wonderful! That gives us something to work with. Try forming a sentence and I'll help with pronunciation."
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};