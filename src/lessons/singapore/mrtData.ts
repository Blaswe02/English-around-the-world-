export const mrtVocab = [
  { word: 'MRT', translation: 'Mass Rapid Transit — de metro van Singapore', emoji: '🚇', example: 'Take the MRT to Orchard — it\'s the fastest way.' },
  { word: 'EZ-Link card', translation: 'Oplaadbare OV-chipkaart voor MRT en bus', emoji: '💳', example: 'Tap your EZ-Link card when you enter and exit.' },
  { word: 'Platform', translation: 'Het perron waar je wacht op de trein', emoji: '🟦', example: 'Stand behind the yellow line on the platform.' },
  { word: 'Exit', translation: 'Uitgang van het station', emoji: '🚪', example: 'Use Exit A for the shopping mall.' },
  { word: 'Transfer', translation: 'Overstappen op een andere lijn', emoji: '🔄', example: 'Transfer at Dhoby Ghaut to the Circle Line.' },
  { word: 'Interchange', translation: 'Station waar meerdere lijnen samenkomen', emoji: '🔀', example: 'Jurong East is a major interchange station.' },
  { word: 'Priority seat', translation: 'Voorrangsplaats voor ouderen en zwangere vrouwen', emoji: '🧓', example: 'Please give up your priority seat to those who need it.' },
  { word: 'Stored value', translation: 'Opgeladen tegoed op je kaart', emoji: '💰', example: 'You don\'t have enough stored value — please top up.' },
];

export const mrtDialogue = [
  {
    id: 'dialogue-1',
    title: 'Asking for directions at the station',
    lines: [
      { speaker: 'Tourist', text: 'Excuse me, how do I get to Marina Bay Sands?' },
      { speaker: 'Local', text: 'Take the Red Line to Marina Bay station.' },
      { speaker: 'Tourist', text: 'Do I need to transfer?' },
      { speaker: 'Local', text: 'No, it\'s direct from here. Takes about 10 minutes.' },
      { speaker: 'Tourist', text: 'Which exit should I use?' },
      { speaker: 'Local', text: 'Use Exit B — then follow the signs to the waterfront.' },
      { speaker: 'Tourist', text: 'Thank you so much!' },
      { speaker: 'Local', text: 'No problem! Enjoy your visit!' },
    ],
    questions: [
      { question: 'Where does the tourist want to go?', options: ['Orchard Road', 'Changi Airport', 'Marina Bay Sands', 'Gardens by the Bay'], correct: 2 },
      { question: 'Does the tourist need to transfer?', options: ['Yes, at Dhoby Ghaut', 'No, it\'s a direct line', 'Yes, at Raffles Place', 'The local doesn\'t know'], correct: 1 },
      { question: 'Which exit should the tourist use?', options: ['Exit A', 'Exit B', 'Exit C', 'Exit D'], correct: 1 },
    ],
  },
  {
    id: 'dialogue-2',
    title: 'Buying a ticket',
    lines: [
      { speaker: 'Tourist', text: 'Excuse me, I need to buy a ticket to Changi Airport.' },
      { speaker: 'Staff', text: 'Sure! You can use the ticket machine or get an EZ-Link card.' },
      { speaker: 'Tourist', text: 'What\'s an EZ-Link card?' },
      { speaker: 'Staff', text: 'It\'s a stored value card — like a travel card. Much easier than buying single tickets.' },
      { speaker: 'Tourist', text: 'How much does it cost to get one?' },
      { speaker: 'Staff', text: 'The card costs $5, and you can add any amount of stored value.' },
      { speaker: 'Tourist', text: 'I\'ll take one. Can I use it on buses too?' },
      { speaker: 'Staff', text: 'Yes — buses, MRT, and even some taxis!' },
    ],
    questions: [
      { question: 'What does the tourist want to do?', options: ['Find a taxi', 'Buy a ticket to Changi Airport', 'Ask for a map', 'Find a hotel'], correct: 1 },
      { question: 'What is an EZ-Link card?', options: ['A credit card', 'A stored value travel card', 'A tourist pass', 'A Singapore ID card'], correct: 1 },
      { question: 'Can the EZ-Link card be used on buses?', options: ['No, only on MRT', 'Yes, on buses, MRT and some taxis', 'Only on weekdays', 'Only if you top up more than $20'], correct: 1 },
    ],
  },
];
