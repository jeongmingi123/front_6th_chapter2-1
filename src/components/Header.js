export class Header {
  constructor() {
    this.itemCountElement = null;
  }

  create() {
    const header = document.createElement('div');
    header.className = 'mb-8';
    header.innerHTML = /* HTML */ `
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    `;

    this.itemCountElement = header.querySelector('#item-count');
    return header;
  }

  updateItemCount(itemCount) {
    if (this.itemCountElement) {
      this.itemCountElement.textContent = '🛍️ ' + itemCount + ' items in cart';
    }
  }
}
