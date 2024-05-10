import http from 'k6/http';
import { sleep, check } from 'k6';

const websites = [
  'http://localhost:8080/NB',
  'http://localhost:8080/UPI',
  'http://localhost:8080/Wallet',
  'http://localhost:8080/CC_DOM',
  'http://localhost:8080/DC_DOM',
];

export let options = {
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
  scenarios: {
    ramping_vus: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 100 },
        { duration: '15s', target: 200 },
        { duration: '15s', target: 500 },
        { duration: '10s', target: 500 },
        { duration: '15s', target: 900 },
        { duration: '15s', target: 1000 },
        { duration: '30s', target: 1000 },
        { duration: '15s', target: 400 },
        { duration: '15s', target: 100 },
        { duration: '15s', target: 100 },
        { duration: '15s', target: 0 },
      ],
    },
  },
};

function generateRandomPayload() {
  return {
    serviceType: "payu",
    transaction_id: Math.floor(Math.random() * 10000000000000),
    merchantid: Math.floor(Math.random() * 10000000000000),
    mode: Math.random() < 0.5 ? "CC" : "DC",
    ibiboCode: Math.random() < 0.5 ? "CC" : "DC",
    transactionParam: {
      paymentSource: "payu",
      Channel: "domestic"
    },
    merchantParam: {
      health_tolerance: 0.00
    },
    gatewayList: {
      351: { gatewayParam: {} },
      254: { gatewayParam: {} },
      158: { gatewayParam: {} }
    },
    extraFields: {
      additionalProp1: "string",
      additionalProp2: "string",
      additionalProp3: "string"
    }
  };
}

export default function () {
  for (const url of websites) {
    const payload = generateRandomPayload();

    const resPost = http.post(url, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    });

    check(resPost, {
      'POST status is 200': (r) => r.status === 200,
      'Response body matches expected structure': (r) => {
        const expectedResponse = {
          status: 1,
          message: "success",
          orderedHealth: [
            { id: 254, health: 0.751 },
            { id: 158, health: 0.413 },
            { id: 351, health: 0.084 }
          ]
        };
        const responseBody = JSON.parse(r.body);
        return JSON.stringify(responseBody) === JSON.stringify(expectedResponse);
      }
    });
  }

  sleep(1 + Math.random() * 2);
}
