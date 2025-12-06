// General states
interface Item {
  name: string
  price: number
}

interface CartItem extends Item {
  quantity: number
}

interface StoreItem extends Item {
  category: string
}
let cartItems: CartItem[] = []
let storeItems: StoreItem[] = []

// Init Code
const allItems = Array.from(document.getElementsByClassName('item')) as HTMLDivElement[]
allItems.forEach((item) => {
  storeItems.push({
    name: item.dataset.name!,
    price: Number(item.dataset.price!),
    category: item.dataset.category!
  }
  )
})

// HTML Code
const cartItemHTMLCode = (productName: string, productPrice: string) =>
  `  
                    <h3>${productName}</h3>
                    <div class="unit-price">
                        <p>Unit Price:</p>
                        <p class="itemPrice" >${productPrice}</p>
                        <p>EGP</p>
                    </div>
                    <div class="quantity">
                        <p>Quantity:</p>
                        <p>x</p>
                        <p class='quantityNum' >1</p>
                        <button class="decByOne" >-1</button>
                        <button class="incByOne" >+1</button>
                    </div>
                    <div class="total-price">
                        <p>Total Price:</p>
                        <p class= "totalItemPrice" >${productPrice}</p>
                        <p>EGP</p>
                    </div>
                    <div class="remove-button-div">
                        <button data-name="${productName}" class="remove-button">Remove</button>
                    </div>
  `

const cartSummaryItemHTMLCode = (productName: string, productPrice: string) => `
            <h1 style="text-align: center;">Cart Summary</h1>
            <ul class="total-cart-items">
                <li class="cart-summary-item">
                    <h3>${productName}:</h3>
                    <p>x1</p>
                    <p>${productPrice} EGP</p>
                </li>
            </ul>
            <div class="cart-total">
                <h3>Cart Total:</h3>
                <h3 id="cart-total-price">${productPrice} EGP</h3>
            </div>
            <button id="checkout-button">Checkout</button>
    `

// Items handling
const itemsContainer = document.getElementsByClassName('items')[0] as HTMLDivElement

itemsContainer.addEventListener('click', (e: Event) => {

  const target = e.target as HTMLElement

  const button = target.closest('.add-to-cart-btn') as HTMLButtonElement | null

  if (!button) return

  const productName = button.dataset.name
  const productPrice = button.dataset.price

  if (productName && productPrice) {
    addToCart(productName, productPrice)
  }

})


// Add to Cart Handling
const cart = document.getElementsByClassName('cart')[0] as HTMLDivElement
const emptyCartText = document.getElementById('empty-cart') as HTMLParagraphElement
const cartItemsUList = document.getElementsByClassName('cart-items')[0] as HTMLUListElement

const handleRemoveClickEvent = (e: Event) => {
  const target = e.target as HTMLElement
  const removeButton = target.closest('.remove-button') as HTMLButtonElement | null

  if (!removeButton) return

  removeCartItem(removeButton.parentElement?.parentElement as HTMLUListElement, removeButton.dataset.name!)

}

const handleIncQuantityClickEvent = (e: Event) => {
  const target = e.target as HTMLElement
  const incButton = target.closest('.incByOne') as HTMLButtonElement | null

  if (!incButton) return

  const cartItem = incButton.closest('.cart-item') as HTMLLIElement
  const productName = cartItem.dataset.productName!

  const item = cartItems.find(i => i.name === productName)
  if (!item) return

  item.quantity += 1

  const quantityPar = cartItem.getElementsByClassName('quantityNum')[0] as HTMLParagraphElement
  quantityPar.textContent = String(item.quantity)

  const itemTotalPrice = cartItem.getElementsByClassName('totalItemPrice')[0] as HTMLParagraphElement
  itemTotalPrice.textContent = String(item.price * item.quantity)

  updateCartSummary()
}

const handleDecQuantityClickEvent = (e: Event) => {
  const target = e.target as HTMLElement
  const decButton = target.closest('.decByOne') as HTMLButtonElement | null

  if (!decButton) return

  const cartItem = decButton.closest('.cart-item') as HTMLLIElement
  const productName = cartItem.dataset.productName!

  const item = cartItems.find(i => i.name === productName)
  if (!item || item.quantity <= 1) return

  item.quantity -= 1

  const quantityPar = cartItem.getElementsByClassName('quantityNum')[0] as HTMLParagraphElement
  quantityPar.textContent = String(item.quantity)

  const itemTotalPrice = cartItem.getElementsByClassName('totalItemPrice')[0] as HTMLParagraphElement
  itemTotalPrice.textContent = String(item.price * item.quantity)

  updateCartSummary()
}

const addToCart = (productName: string, productPrice: string) => {
  const existingItem = cartItems.find(item => item.name === productName)

  if (existingItem) {
    alert('This product is already in the cart.')
    return
  }

  cartItems.push({
    name: productName,
    price: Number(productPrice),
    quantity: 1
  })

  emptyCartText.style.display = 'none'

  const cartItem = document.createElement('li')
  cartItem.className = 'cart-item'
  cartItem.dataset.productName = productName
  cartItem.innerHTML = cartItemHTMLCode(productName, productPrice)

  cartItemsUList.appendChild(cartItem)

  if (cartItems.length === 1) {
    const cartSummary = document.createElement('div')
    cartSummary.className = 'cart-summary'
    cartSummary.innerHTML = cartSummaryItemHTMLCode(productName, productPrice)

    cart.appendChild(cartSummary)

    cartItemsUList.addEventListener('click', handleRemoveClickEvent)

    addCheckoutButtonEventListener()
  }
  else {
    updateCartSummary()
  }
  cartItem.addEventListener('click', handleIncQuantityClickEvent)
  cartItem.addEventListener('click', handleDecQuantityClickEvent)

}

const removeCartItem = (element: HTMLUListElement, productName: string) => {

  cartItems = cartItems.filter(item => item.name !== productName)

  cartItemsUList.removeChild(element)

  if (cartItems.length === 0) {
    cartItemsUList.removeEventListener('click', handleRemoveClickEvent)
    const cartSummary = document.getElementsByClassName('cart-summary')[0] as HTMLDivElement
    cart.removeChild(cartSummary)
    emptyCartText.style.display = 'block'
  } else {
    updateCartSummary()
  }
}

const updateCartSummary = () => {
  const totalCartItemsUL = document.querySelector('.total-cart-items') as HTMLUListElement
  const cartTotalPrice = document.getElementById('cart-total-price') as HTMLHeadingElement

  totalCartItemsUL.innerHTML = ''

  let total = 0
  cartItems.forEach(item => {
    const summaryItem = document.createElement('li')
    summaryItem.className = 'cart-summary-item'
    summaryItem.innerHTML = `
      <h3>${item.name}:</h3>
      <p>x${item.quantity}</p>
      <p>${item.price * item.quantity} EGP</p>
    `
    totalCartItemsUL.appendChild(summaryItem)
    total += item.price * item.quantity
  })

  cartTotalPrice.textContent = `${total} EGP`
}


const addCheckoutButtonEventListener = () => {
  const checkoutButton = document.getElementById('checkout-button') as HTMLButtonElement

  checkoutButton.addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.')
      return
    }

    alert('Thank you for your purchase!')

    cartItems = []
    cartItemsUList.innerHTML = ''
    const cartSummary = document.getElementsByClassName('cart-summary')[0] as HTMLDivElement
    cart.removeChild(cartSummary)
    emptyCartText.style.display = 'block'
  })
}

//Filters

let searchTerm = ''
let category = 'All Categories'
let price = 'All Prices'

const searchInput = document.getElementById('search-input') as HTMLInputElement
searchInput.addEventListener('input', (e: Event) => {
  const target = e.target as HTMLInputElement
  searchTerm = target.value.toLowerCase()
  applyFilters()
})

const categorySelect = document.getElementById('category-filter') as HTMLSelectElement
categorySelect.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLSelectElement
  category = target.value
  applyFilters()
})

const priceSelect = document.getElementById('price-filter') as HTMLSelectElement
priceSelect.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLSelectElement
  price = target.value
  applyFilters()
})


const applyFilters = () => {
  let filteredItems: StoreItem[] = storeItems
  filteredItems = filteredItems.filter((item) => {
    return (price === "All Prices" ? true : checkPrice(item, price)) && (searchTerm === "" ? true : item.name.toLowerCase().includes(searchTerm)) && (category === "All Categories" ? true : checkCategory(item, category))
  })
  updateItemsViewed(filteredItems)
}

const checkPrice = (item: StoreItem, price: string) => {

  let maxPrice: number = 0
  let minPrice: number = 0
  if (price.includes('+')) {
    minPrice = Number(price.split('+')[0].trim())
    maxPrice = Infinity
  }
  else {
    minPrice = Number(price.split('-')[0].trim())
    maxPrice = Number(price.split('-')[1].trim())
  }

  if (item.price >= minPrice && item.price <= maxPrice)
    return true
  else return false
}

const checkCategory = (item: StoreItem, category: string) => {
  if (item.category === category)
    return true
  else return false
}

const updateItemsViewed = (filteredItems: StoreItem[]) => {
  let filteredNames: string[] = filteredItems.map(item => item.name)
  allItems.forEach(item => {
    if (filteredNames.includes(item.dataset.name!)) {
      item.style.display = 'flex'
    }
    else {
      item.style.display = 'none'
    }
  });
}