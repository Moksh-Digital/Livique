import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 100,       // 100 users at same time
  duration: '30s'
};

export default function () {
  http.get('https://livique.co.in/');
  sleep(1);
}
