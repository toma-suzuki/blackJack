const cardList = document.getElementById('card_list_area');
const dealerArea = document.getElementById('dealer_area');
const playerArea = document.getElementById('player_area');
const dealerCardArea = document.getElementById('dealer_card_area');
const playerCardArea = document.getElementById('player_card_area');
const dealerScore = document.getElementById('dealer_score');
const playerScore = document.getElementById('player_score');
const hitButton = document.getElementById('hit_button');
const standButton = document.getElementById('stand_button');

const marks = {
  0: 's',
  1: 'c',
  2: 'd',
  3: 'h',
};

const numbers = {
  0: '01',
  1: '02',
  2: '03',
  3: '04',
  4: '05',
  5: '06',
  6: '07',
  7: '08',
  8: '09',
  9: '10',
  10: '11',
  11: '12',
  12: '13',
};

const powers = {
  '01': 11,
  '02': 2,
  '03': 3,
  '04': 4,
  '05': 5,
  '06': 6,
  '07': 7,
  '08': 8,
  '09': 9,
  '10': 10,
  '11': 10,
  '12': 10,
  '13': 10,
};

const initCards = () => {
  let cards = [];

  for (let i = 0; i < 4; i++) {
    for (let k = 0; k < 13; k++) {
      let card = { mark: marks[i], number: numbers[k], power: powers[numbers[k]] };

      cards.push(card);
    }
  }

  return cards;
};

const createDecks = (set) => {
  let decks = [];

  for (let i = 0; i < set; i++) {
    let cards = initCards();
    let deck = [];

    while (deck.length < 52) {
      const ran = Math.floor(Math.random() * 53);

      if (cards[ran]) {
        deck.push(cards[ran]);
        cards[ran] = '';
      }
    }

    if (i === 0) {
      decks = [...deck];
    } else {
      decks = decks.concat(deck);
    }
  }

  return decks;
};

const createCardElement = (card) => {
  const ret = document.createElement('img');
  ret.classList.add('card_img');
  ret.setAttribute('src', `./img/trump/${card.mark}${card.number}.png`);

  return ret;
};

const showCardList = (trumps) => {
  trumps.forEach((card, index) => {
    cardList.appendChild(createCardElement(card));
  });
};

const trumps = createDecks(2);

let stockTrumps = [...trumps];
let dealerCards = [];
let playerCards = [];
let dealerScoreNumber = 0;
let playerScoreNumber = 0;

const disableCard = (index) => {
  cardList.children[index].style.filter = 'grayscale(80%)';
};

const disableButton = () => {
  hitButton.style.pointerEvents = 'none';
  standButton.style.pointerEvents = 'none';
  hitButton.style.color = 'gray';
  standButton.style.color = 'gray';
};

const changeScore = (side) => {
  let score = 0;

  if (side === 'dealer') {
    dealerCards.forEach((card) => {
      score += card.power;
    });
    dealerScore.innerText = score;

    if (score === 21) {
      dealerScore.style.color = 'aqua';

      if (dealerCards.length === 2) {
        dealerScore.style.color = 'blue';
      }
    } else if (score >= 17) {
      dealerScore.style.color = 'darkorange';

      if (score > 21) {
        dealerScore.style.color = 'red';
      }
    }

    dealerScoreNumber = score;
  } else if (side === 'player') {
    playerCards.forEach((card) => {
      score += card.power;
    });

    playerScore.innerText = score;

    if (score === 21) {
      playerScore.style.color = 'aqua';

      if (playerCards.length === 2) {
        playerScore.style.color = 'blue';
        playerScore.innerText += ' (BlackJack!!)';
      }

      disableButton();
      startGame();
    } else if (score > 21) {
      playerScore.style.color = 'red';
      playerScore.innerText += ' (BURST!)';

      disableButton();
      endGame();
    }

    playerScoreNumber = score;
  }
};

const dealTrump = () => {
  dealerCards = [];
  playerCards = [];

  dealerCards.push(stockTrumps[0], stockTrumps[1]);
  playerCards.push(stockTrumps[2]);

  stockTrumps.splice(0, 3);

  dealerCards.forEach((card) => {
    dealerCardArea.appendChild(createCardElement(card));
  });
  dealerCardArea.children[1].setAttribute('src', `./img/trump/bk0.png`);

  playerCards.forEach((card) => {
    playerCardArea.appendChild(createCardElement(card));
  });

  dealerScore.innerText = dealerCards[0].power;
  changeScore('player');
};

const openDealerTrump = () => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      dealerCardArea.children[1].setAttribute('src', `./img/trump/${dealerCards[1].mark}${dealerCards[1].number}.png`);
      changeScore('dealer');

      if (dealerScoreNumber >= 17) {
        reject();
      }

      resolve();
    }, 1500);
  });
};

const addDealerTrump = () => {
  return new Promise((resolve, reject) => {
    const addId = window.setInterval(() => {
      dealerCards.push(stockTrumps[0]);
      dealerCardArea.appendChild(createCardElement(stockTrumps[0]));

      stockTrumps.splice(0, 1);
      changeScore('dealer');

      if (dealerScoreNumber >= 17) {
        clearInterval(addId);

        if (dealerScoreNumber > 21) {
          reject('win');
        }

        reject('judge');
      }

      resolve();
    }, 2000);
  });
};

const addPlayerTrump = () => {
  playerCards.push(stockTrumps[0]);
  playerCardArea.appendChild(createCardElement(stockTrumps[0]));

  stockTrumps.splice(0, 1);
  changeScore('player');
};

const startGame = async () => {
  disableButton();

  await openDealerTrump()
    .then(() => addDealerTrump().catch((msg) => judgeWinner(msg)))
    .catch(() => judgeWinner());
};

const endGame = () => {

};

const judgeWinner = (msg) => {
  console.log(msg);
};

showCardList(trumps);
dealTrump();












