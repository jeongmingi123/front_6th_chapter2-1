import { INITIAL_PRODUCTS } from './data/products.js';

import { App } from './components/App.js';

function main() {
  const app = new App();
  app.initialize(INITIAL_PRODUCTS);
}

// 앱 시작
main();
