
interface SpiritualMessage {
  en: string;
  hi: string;
}

export const localSpiritualMessages: SpiritualMessage[] = [
  {
    en: "Begin each day with gratitude and your heart will find peace",
    hi: "प्रत्येक दिन की शुरुआत कृतज्ञता के साथ करें और आपका हृदय शांति पाएगा"
  },
  {
    en: "Your breath is the bridge between your body and soul",
    hi: "आपकी सांस आपके शरीर और आत्मा के बीच का पुल है"
  },
  {
    en: "The light within you is brighter than any darkness you face",
    hi: "आपके अंदर का प्रकाश आपके सामने किसी भी अंधकार से अधिक उज्जवल है"
  },
  {
    en: "Silence is the language of the universe; listen carefully",
    hi: "मौन ब्रह्मांड की भाषा है; ध्यान से सुनें"
  },
  {
    en: "In stillness, you will find your true self",
    hi: "स्थिरता में, आप अपने वास्तविक स्वरूप को पाएंगे"
  },
  {
    en: "The journey of a thousand mantras begins with a single chant",
    hi: "हजारों मंत्रों की यात्रा एक जाप से शुरू होती है"
  },
  {
    en: "Let your soul dance to the rhythm of the universe",
    hi: "अपनी आत्मा को ब्रह्मांड की लय पर नृत्य करने दें"
  },
  {
    en: "Every breath is a gift; use it to chant the divine",
    hi: "हर सांस एक उपहार है; इसका उपयोग दिव्य का जाप करने के लिए करें"
  },
  {
    en: "Like a lotus, rise from the mud of worldly attachments",
    hi: "कमल की तरह, सांसारिक लगावों के कीचड़ से ऊपर उठें"
  },
  {
    en: "The sound of your mantra carries your intention to the universe",
    hi: "आपके मंत्र की ध्वनि आपके इरादे को ब्रह्मांड तक पहुंचाती है"
  }
];

export const fetchSpiritualMessage = async (): Promise<{ content: string, contentHi: string }> => {
  try {
    const response = await fetch('https://api.quotable.io/quotes?tags=spirituality|wisdom|religion&limit=1');
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return { 
        content: data.results[0].content, 
        contentHi: data.results[0].content // Ideally we'd translate this, but for now we'll use the English version
      };
    } else {
      return getLocalSpiritualMessage();
    }
  } catch (error) {
    return getLocalSpiritualMessage();
  }
};

export const getLocalSpiritualMessage = (): { content: string, contentHi: string } => {
  const randomIndex = Math.floor(Math.random() * localSpiritualMessages.length);
  const message = localSpiritualMessages[randomIndex];
  
  return {
    content: message.en,
    contentHi: message.hi
  };
};
