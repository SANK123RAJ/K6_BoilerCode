import http from 'k6/http';
import { sleep, check } from 'k6';

// Define an array of website URLs along with their corresponding payloads
const websites = [
  { url: 'https://example.com/NB', payload: generatePayloadType1() },
  { url: 'https://example.com/UPI', payload: generatePayloadType1() },
  { url: 'https://example.com/Wallet', payload: generatePayloadType1() },
  { url: 'https://example.com/CC_DOM', payload: generatePayloadType2() },
  { url: 'https://example.com/DC_DOM', payload: generatePayloadType2() },
  // Add more URLs as needed with their respective payloads
];

// Define the configuration for the test
export let options = {
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete within 500ms
    // 'http_req_failed': ['rate<0.01'], // Error rate should be less than 1%
  },
  scenarios: {
    ramping_vus: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 100 }, // Ramp up to 100 VUs over 15 seconds
        { duration: '15s', target: 200 }, // Ramp up to 200 VUs over 15 seconds
        { duration: '15s', target: 500 },
        { duration: '10s', target: 500 }, // Ramp up to 300 VUs over 15 seconds
        { duration: '15s', target: 900 }, // Ramp up to 900 VUs over 15 seconds
        { duration: '15s', target: 1000 }, // Ramp up to 1000 VUs over 15 seconds
        { duration: '30s', target: 1000 }, // Maintain 1000 VUs for 30 seconds// Ramp down to 500 VUs over 15 seconds
        { duration: '15s', target: 400 }, // Ramp down to 400 VUs over 15 seconds
        { duration: '15s', target: 100 }, // Ramp down to 100 VUs over 15 seconds
        { duration: '15s', target: 100 },
        { duration: '15s', target: 0 }, // Ramp down to 0 VUs over 15 seconds
      ],
    },
  },
};

// Function to generate payload type 1
function generatePayloadType1() {
  return {
    name: 'Rahul',
    phone: Math.floor(Math.random() * 10000000000).toString(), // Random 10-digit phone number
    email: 'sankalp.raj@payu.in',
    amount: Math.floor(Math.random() * 100000), // Random amount up to 100000
    transaction_id: Math.floor(Math.random() * 10000000000000), // Random 13-digit transaction ID
    sender_account_number: Math.floor(Math.random() * 10000000000), // Random 10-digit account number
    ip_address: Math.floor(Math.random() * 10000000000000), // Random 13-digit IP address
    receiver_account_number: Math.floor(Math.random() * 10000000000), // Random 10-digit account number
  };
}

// Function to generate payload type 2
function generatePayloadType2() {
  return {
    name: 'Rahul',
    phone: Math.floor(Math.random() * 10000000000).toString(), // Random 10-digit phone number
    email: 'sankalp.raj@payu.in',
    amount: Math.floor(Math.random() * 100000), // Random amount up to 100000
    transaction_id: Math.floor(Math.random() * 10000000000000), // Random 13-digit transaction ID
    sender_account_number: Math.floor(Math.random() * 10000000000), // Random 10-digit account number
    ip_address: Math.floor(Math.random() * 10000000000000), // Random 13-digit IP address
    receiver_account_number: Math.floor(Math.random() * 10000000000), // Random 10-digit account number
    // Define fields for payload type 2
  };
}

// Define the main function to execute the test
export default function () {
  // Iterate over each website URL along with its payload
  for (const { url, payload } of websites) {
    // Launch VUs for each website
    const resGet = http.get(url);
    check(resGet, {
      'GET status is 200': (r) => r.status === 200,
    });

    const resPost = http.post(url, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    });
    check(resPost, {
      'POST status is 200': (r) => r.status === 200,
    });
  }

  // Sleep for a short random period between 1 to 3 seconds
  sleep(1 + Math.random() * 2);
}
