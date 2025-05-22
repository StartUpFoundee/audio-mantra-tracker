
export interface SpiritualSymbol {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Using Unicode symbols for simplicity
export const spiritualSymbols: SpiritualSymbol[] = [
  {
    id: 'om',
    name: 'Om (ॐ)',
    description: 'Sacred sound and spiritual symbol in Indian religions',
    image: 'ॐ'
  },
  {
    id: 'lotus',
    name: 'Lotus',
    description: 'Symbol of purity, enlightenment, self-regeneration, and rebirth',
    image: '🪷'
  },
  {
    id: 'chakra',
    name: 'Chakra',
    description: 'Energy points in the subtle body',
    image: '☸️'
  },
  {
    id: 'sri-yantra',
    name: 'Sri Yantra',
    description: 'Sacred geometry pattern representing cosmic energy',
    image: '✡️'
  },
  {
    id: 'buddha',
    name: 'Buddha',
    description: 'Symbol of enlightenment and peace',
    image: '☸'
  },
  {
    id: 'shiva',
    name: 'Shiva Lingam',
    description: 'Divine symbol that represents Lord Shiva',
    image: '🕉️'
  },
  {
    id: 'tree-of-life',
    name: 'Tree of Life',
    description: 'Connection between heaven and earth',
    image: '🌳'
  },
  {
    id: 'yin-yang',
    name: 'Yin Yang',
    description: 'Balance of opposing forces',
    image: '☯️'
  },
  {
    id: 'cross',
    name: 'Cross',
    description: 'Symbol of Christianity',
    image: '✝️'
  },
  {
    id: 'star-and-crescent',
    name: 'Star and Crescent',
    description: 'Symbol associated with Islam',
    image: '☪️'
  }
];
