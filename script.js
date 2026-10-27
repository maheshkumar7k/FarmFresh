const starterProducts = [
  {id:"p1",name:"Farm Fresh Tomatoes",category:"Vegetables",price:35,unit:"kg",description:"Juicy and picked with care",image:"https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80",seller:"Green Valley Farm"},
  {id:"p2",name:"Fresh Spinach",category:"Vegetables",price:25,unit:"bunch",description:"Tender green leafy goodness",image:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",seller:"Green Valley Farm"},
  {id:"p3",name:"Organic Carrots",category:"Vegetables",price:45,unit:"kg",description:"Crunchy, naturally sweet carrots",image:"https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=600&q=80",seller:"Sunrise Growers"},
  {id:"p4",name:"Fresh Broccoli",category:"Vegetables",price:60,unit:"piece",description:"A fresh choice for your meals",image:"https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=600&q=80",seller:"Sunrise Growers"},
  {id:"p5",name:"Sweet Red Apples",category:"Fruits",price:140,unit:"kg",description:"Crisp fruit for every day",image:"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",seller:"Orchard Lane"},
  {id:"p6",name:"Ripe Bananas",category:"Fruits",price:55,unit:"dozen",description:"Naturally sweet and satisfying",image:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",seller:"Orchard Lane"},
  {id:"p7",name:"Fresh Oranges",category:"Fruits",price:85,unit:"kg",description:"Bright citrus with juicy flavour",image:"https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80",seller:"Orchard Lane"},
  {id:"p8",name:"Farm Milk",category:"Daily Needs",price:35,unit:"litre",description:"A daily essential for your home",image:"https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",seller:"Happy Cow Dairy"}
];

const STORAGE = {products:"farmfresh_products_v1",cart:"farmfresh_cart_v1",user:"farmfresh_user_v1",orders:"farmfresh_orders_v1"};
let currentCategory = "All";
let selectedRole = "buyer";
let toastTimer;
let products = readStorage(STORAGE.products, starterProducts);
let cart = readStorage(STORAGE.cart, []);
let currentUser = readStorage(STORAGE.user, null);
let orders = readStorage(STORAGE.orders, []);

function readStorage(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : structuredClone(fallback); }
  catch { return structuredClone(fallback); }
}
function saveStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { showToast("Could not save data in this browser."); }
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function safeImage(value) {
  try { const url = new URL(value, window.location.href); return ["https:","http:"].includes(url.protocol) ? url.href : ""; }
  catch { return ""; }
}
function formatPrice(value) { return "₹" + Number(value).toLocaleString("en-IN",{maximumFractionDigits:2}); }

function showHome() {
  document.getElementById("home-view").classList.remove("hidden");
  document.getElementById("seller-view").classList.add("hidden");
  window.scrollTo({top:0,behavior:"smooth"});
  renderProducts();
}
function openAuth(role="buyer") {
  chooseRole(role);
  document.getElementById("auth-message").textContent = "";
  document.getElementById("auth-modal").classList.remove("hidden");
}
function closeModal(id) { document.getElementById(id).classList.add("hidden"); }
function chooseRole(role) {
  selectedRole = role;
  document.getElementById("buyer-role").classList.toggle("active",role==="buyer");
  document.getElementById("seller-role").classList.toggle("active",role==="seller");
  document.getElementById("auth-title").textContent = role==="seller" ? "Welcome, farmer" : "Welcome, shopper";
  document.getElementById("auth-subtitle").textContent = role==="seller" ? "Sign in to list and manage your farm products." : "Sign in to discover fresh food from local farms.";
}
document.getElementById("auth-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const user = {name:String(form.get("name")).trim(),email:String(form.get("email")).trim().toLowerCase(),role:selectedRole};
  if (!user.name || !user.email) return;
  currentUser = user;
  saveStorage(STORAGE.user,currentUser);
  closeModal("auth-modal");
  event.currentTarget.reset();
  if (selectedRole==="seller") showSellerDashboard();
  else { showHome(); showToast("Welcome, "+user.name+"! Buyer demo login successful."); }
});
function logout() {
  currentUser = null;
  saveStorage(STORAGE.user,null);
  showHome();
  showToast("You have logged out.");
}
function showSellerDashboard() {
  if (!currentUser || currentUser.role!=="seller") { openAuth("seller"); return; }
  document.getElementById("home-view").classList.add("hidden");
  document.getElementById("seller-view").classList.remove("hidden");
  document.getElementById("seller-product-count").textContent = products.filter(p=>p.sellerEmail===currentUser.email).length;
  document.getElementById("seller-order-count").textContent = orders.filter(o=>o.sellerEmail===currentUser.email).length;
  renderSellerProducts();
  window.scrollTo({top:0,behavior:"smooth"});
}
function setCategory(category,button) {
  currentCategory=category;
  document.querySelectorAll(".category-tab").forEach(tab=>tab.classList.remove("active"));
  button.classList.add("active");
  renderProducts();
}
function renderProducts() {
  const grid=document.getElementById("product-grid");
  if(!grid)return;
  const query=(document.getElementById("search-input")?.value||"").trim().toLowerCase();
  const filtered=products.filter(p=>(currentCategory==="All"||p.category===currentCategory)&&
    (p.name.toLowerCase().includes(query)||p.category.toLowerCase().includes(query)||p.seller.toLowerCase().includes(query)));
  if(!filtered.length){grid.innerHTML='<div class="empty-state">No products found. Try another search.</div>';return;}
  grid.innerHTML=filtered.map(p=>{
    const image=safeImage(p.image);
    return `<article class="product-card">
      <div class="product-photo">${image?`<img src="${escapeHTML(image)}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.style.display='none'">`:""}
      <span class="product-badge">Farm pick</span></div>
      <div class="product-info"><span class="product-category">${escapeHTML(p.category)}</span>
      <h3>${escapeHTML(p.name)}</h3><p class="product-description">${escapeHTML(p.description||"Fresh from the farm")}</p>
      <div class="product-bottom"><div class="product-price">${formatPrice(p.price)} <small>/ ${escapeHTML(p.unit)}</small></div>
      <button class="add-button" onclick="addToCart('${escapeHTML(p.id)}')">+ Add</button></div>
      <p class="product-description" style="margin-top:10px;margin-bottom:0">👨‍🌾 ${escapeHTML(p.seller)}</p></div></article>`;
  }).join("");
}
function setCartCount() {
  document.getElementById("cart-count").textContent=cart.reduce((sum,item)=>sum+item.quantity,0);
}
function addToCart(id) {
  const product=products.find(p=>p.id===id);
  if(!product)return;
  const existing=cart.find(item=>item.id===id);
  if(existing)existing.quantity++;
  else cart.push({id,quantity:1});
  saveStorage(STORAGE.cart,cart);
  setCartCount();
  showToast(product.name+" added to cart");
}
function openCart() {
  renderCart();
  document.getElementById("cart-modal").classList.remove("hidden");
}
function renderCart() {
  const items=document.getElementById("cart-items");
  const rows=cart.map(item=>({item,product:products.find(p=>p.id===item.id)})).filter(row=>row.product);
  if(!rows.length)items.innerHTML='<div class="empty-state">Your cart is empty.<br>Explore the harvest and add something fresh.</div>';
  else items.innerHTML=rows.map(({item,product})=>`<div class="cart-row"><div class="cart-emoji">${product.category==="Fruits"?"🍎":product.category==="Vegetables"?"🥦":"🧺"}</div><div class="cart-product"><strong>${escapeHTML(product.name)}</strong><small>${formatPrice(product.price)} / ${escapeHTML(product.unit)}</small></div><div class="qty-controls"><button aria-label="Remove one" onclick="changeQuantity('${escapeHTML(product.id)}',-1)">−</button><span>${item.quantity}</span><button aria-label="Add one" onclick="changeQuantity('${escapeHTML(product.id)}',1)">+</button></div></div>`).join("");
  const total=rows.reduce((sum,{item,product})=>sum+product.price*item.quantity,0);
  document.getElementById("cart-total").textContent=formatPrice(total);
  document.getElementById("cart-message").textContent="";
}
function changeQuantity(id,delta) {
  const item=cart.find(i=>i.id===id);
  if(!item)return;
  item.quantity+=delta;
  if(item.quantity<=0)cart=cart.filter(i=>i.id!==id);
  saveStorage(STORAGE.cart,cart);
  setCartCount();
  renderCart();
}
function checkout() {
  if(!cart.length){document.getElementById("cart-message").textContent="Your cart is empty.";return;}
  if(!currentUser || currentUser.role!=="buyer"){closeModal("cart-modal");openAuth("buyer");showToast("Please sign in as a buyer to place a demo order.");return;}
  const order={id:"FF"+Date.now(),buyerEmail:currentUser.email,buyerName:currentUser.name,items:cart.map(item=>({...item})),createdAt:new Date().toISOString()};
  orders.push(order);
  saveStorage(STORAGE.orders,orders);
  cart=[];
  saveStorage(STORAGE.cart,cart);
  setCartCount();
  renderCart();
  document.getElementById("cart-message").textContent="Demo order placed successfully! No payment was taken.";
  showToast("Demo order placed. Thank you!");
}
document.getElementById("product-form").addEventListener("submit",event=>{
  event.preventDefault();
  if(!currentUser||currentUser.role!=="seller"){showToast("Please log in as a seller.");return;}
  const form=new FormData(event.currentTarget);
  const name=String(form.get("name")).trim();
  const price=Number(form.get("price"));
  if(!name||!Number.isFinite(price)||price<=0){showToast("Enter a valid product name and price.");return;}
  const suppliedImage=String(form.get("image")||"").trim();
  const product={id:"u"+Date.now(),name,category:String(form.get("category")),price,unit:String(form.get("unit")),description:String(form.get("description")||"Fresh from the farm").trim(),image:safeImage(suppliedImage),seller:currentUser.name,sellerEmail:currentUser.email};
  products.unshift(product);
  saveStorage(STORAGE.products,products);
  event.currentTarget.reset();
  renderSellerProducts();
  document.getElementById("seller-product-count").textContent=products.filter(p=>p.sellerEmail===currentUser.email).length;
  showToast("Product added to your demo listing.");
});
function renderSellerProducts() {
  const list=document.getElementById("seller-product-list");
  if(!list||!currentUser)return;
  const mine=products.filter(p=>p.sellerEmail===currentUser.email);
  if(!mine.length){list.innerHTML='<div class="seller-empty">You have not added any products yet. Use the form above to list your first product.</div>';return;}
  list.innerHTML=mine.map(p=>`<div class="seller-item">${safeImage(p.image)?`<img src="${escapeHTML(safeImage(p.image))}" alt="">`:'<img alt="" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23f2f6e9%22/%3E%3Ctext x=%2250%25%22 y=%2260%25%22 font-size=%2226%22 text-anchor=%22middle%22%3E🌱%3C/text%3E%3C/svg%3E">' }<div class="seller-item-info"><strong>${escapeHTML(p.name)}</strong><small>${escapeHTML(p.category)} · ${formatPrice(p.price)} / ${escapeHTML(p.unit)}</small></div><button class="delete-button" onclick="deleteProduct('${escapeHTML(p.id)}')">Delete</button></div>`).join("");
}
function deleteProduct(id) {
  if(!currentUser||currentUser.role!=="seller")return;
  const product=products.find(p=>p.id===id);
  if(!product||product.sellerEmail!==currentUser.email)return;
  products=products.filter(p=>p.id!==id);
  cart=cart.filter(item=>item.id!==id);
  saveStorage(STORAGE.products,products);
  saveStorage(STORAGE.cart,cart);
  setCartCount();
  renderSellerProducts();
  renderProducts();
  document.getElementById("seller-product-count").textContent=products.filter(p=>p.sellerEmail===currentUser.email).length;
  showToast("Product removed.");
}
function showToast(message) {
  const toast=document.getElementById("toast");
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
document.querySelectorAll(".modal-backdrop").forEach(backdrop=>backdrop.addEventListener("click",event=>{
  if(event.target===backdrop)backdrop.classList.add("hidden");
}));
document.addEventListener("keydown",event=>{if(event.key==="Escape")document.querySelectorAll(".modal-backdrop").forEach(m=>m.classList.add("hidden"));});
renderProducts();
setCartCount();
if(currentUser?.role==="seller")showSellerDashboard();
