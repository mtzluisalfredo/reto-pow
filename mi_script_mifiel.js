const axios = require('axios');
const CryptoJS = require('crypto-js');

const mifielApi = axios.create({
  baseURL: 'https://candidates.mifiel.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

async function main() {
  try {
    const response1 = await mifielApi.post('/api/v1/users', {
      name: 'Luis Alfredo',
      email: 'luisalfredomtz@hotmail.com',
    });

    const id = response1.data.id;
    const challenge = response1.data.next_challenge.challenge;


    const hash = CryptoJS.SHA256(challenge).toString();

    await mifielApi.put(`/api/v1/users/${id}/challenge/digest`, {
      result: hash,
    });

    const difficulty = response1.data.next_challenge.difficulty;
    let nonce = 0;
    let pow = '';
    while (!pow.startsWith('0'.repeat(difficulty))) {
      nonce++;
      pow = CryptoJS.SHA256(`${challenge}${nonce}`).toString();
    }
    await mifielApi.put(`/api/v1/users/${id}/challenge/pow`, {
      result: nonce,
    });
    
  } catch (error) {
    console.error('Ocurrió un error:', error);
  }
}

main();
