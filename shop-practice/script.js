const productContainer = document.getElementById("product-container");
const categerySelect = document.getElementById("category");
const serchInput = document.getElementById("serch");
const maxPriceInput = document.getElementById("max-price");
const stock = document.getElementById("in-stock");
const resetfilters = document.getElementById("reset-filters");
const dailog = document.getElementById("cart-dialog");

const openCart = document.getElementById("open-cart");
const cartTotal = document.getElementById("cart-total");

const closeCart = document.getElementById("close-cart");
const productCarte = document.getElementById("product-carte");
const closeCarte = document.getElementById("closeCart");
const Reservation = document.getElementById("reservation");
const diolog2 = document.getElementById("diolog");
const forme = document.getElementById("forme");
const input = forme.querySelectorAll("input");

const API_BASE = "http://localhost:3000/api";

data();
createCtegery();
inStock();
//filtredProduct();

addProducts();


async function getData() {
  try {
    const response = await fetch(API_BASE + "/products");

    if (!response.ok) {
      throw new Error("Impossible de charger les produits");
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.log(error.message);
  }
}

async function data() {
  const products = await getData();

  //console.log(products);
  if (!products) {
    productContainer.innerHTML =
      "Impossible de charger les produits. Veuillez réessayer";
    return;
  }
  afficheData(products);
}

function afficheData(products) {
  productContainer.innerHTML = "";
  if (products.length == 0) {
    productContainer.innerHTML = `<h3 class=" text-[15px] font-bold "> Aucun produit disponible pour le moment.</h3>`;
    return;
  }

  products.forEach((element) => {
    // console.log(element);
    //' console.log(element.image);

    productContainer.innerHTML += `<div  class="productCart  border  rounded-xl w-1/4">
                <div class="w-full ">
                    <img src= http://localhost:3000${element.image} class="rounded-xl">
                </div>
                <div class="pl-10 pr-10 pb-3 pt-3">
                <h3 class=" text-[20px] font-bold ">${element.name} </h3>
                <p> ${element.description}</p>
                <p> <span class="text-gray-600"> price :  </span> ${element.price} $</p>
                <p> <span class="text-gray-600"> stock :  </span>${element.stock} </p>
                <p > <span class="text-gray-600 text-[15px]"> Category :  </span>${element.categoryName}</p>
                <div class="w-full flex gap-4">
                <input type="number" name="stock"  min="1" max="${element.stock}" value="1"  class ="quantity-input w-1/3 border border-black rounded-lg py-2 px-2">
                <button id="${element.id}" class=" add-to-cart  border rounded-lg w-full bg-blue-200">Add Product</button>
            </div>
             </div>
             </div>`;
  });
}

async function serchProducts(serch) {
  try {
    let url = await fetch(`${API_BASE}/products?search=${serch}`);
    console.log(url.status);
    let productSearch = await url.json();

    if (productSearch.length == 0) {
      productContainer.innerHTML = `<p>Aucun résultat trouvé.</p>`;
      return;
    }

    afficheData(productSearch);
  } catch (error) {
    console.log(error.message);
    productContainer.innerHTML = `<h3>Aucun résultat.</h3>`;
  }
}

async function getCategory() {
  try {
    const response = await fetch(API_BASE + "/categories");
    if (!response.ok) {
      throw new Error("Erreur category");
    }
    const category = await response.json();
    return category;
  } catch (error) {
    console.log(error.message);
  }
}

async function createCtegery() {
  try {
    const category = await getCategory();
    // console.log(category);
    category.forEach((element) => {
      const option = document.createElement("option");
      option.value = `${element.id}`;
      option.textContent = `${element.name}`;
      categerySelect.appendChild(option);
    });
  } catch (error) {
    console.log(error.message);
    categerySelect.innerHTML = `<option>Aucun category.</option>`;
  }
}

async function filterProductsParCategory(category) {
  try {
    if (category.value == "") {
      let url = await fetch(`${API_BASE}/products`);
      let Product = await url.json();
      afficheData(Product);
    }
    let url = await fetch(`${API_BASE}/products?categoryId=${category}`);
    console.log(url.status);
    let filteredProduct = await url.json();
    afficheData(filteredProduct);
  } catch (error) {
    console.log(error.message);
  }
}

async function filterDataMaxPrice(maxPrice) {
  let url = await fetch(`${API_BASE}/products?maxPrice=${maxPrice}`);
  console.log(url.status);
  let filtredProduct = await url.json();
  console.log(filtredProduct);
  afficheData(filtredProduct);
}

async function inStock() {
  try {
    stock.addEventListener("change", async function (event) {
      console.log(event.target.checked);
      //   let url = await fetch(`${API_BASE}/products?inStock=${chek}`);
      //   console.log(url.status);
      //   let productInStock = await url.json();
      //  afficheData(productInStock);
      filtredProduct();
    });
  } catch (error) {
    console.log(error.message);
  }
}

serchInput.addEventListener("input", function () {
  serchProducts(serchInput.value);
});

categerySelect.addEventListener("change", function () {
  // filterProductsParCategory(categerySelect.value);
  filtredProduct();
});

maxPriceInput.addEventListener("input", function () {
  // filterDataMaxPrice(maxPriceInput.value);
  filtredProduct();
});
async function filtredProduct() {
  try {
    const params = new URLSearchParams();
    if (categerySelect.value !== "") {
      params.append("categoryId", categerySelect.value);
    }
    if (maxPriceInput.value !== "") {
      params.append("maxPrice", maxPriceInput.value);
    }
    if (stock.checked == true) {
      params.append("inStock", true);
    }

    const response = await fetch(`${API_BASE}/products?${params}`);
    const products = await response.json();
    afficheData(products);
  } catch (error) {
    console.log(error.message);
    productContainer.innerHTML = `<h3>Aucun products.</h3>`;
  }
}

resetfilters.addEventListener("click", function (event) {
  categerySelect.value = "";
  maxPriceInput.value = "";
  stock.checked = false;
  data();
});
///partie2 :

function saveCarte(cartes) {
  localStorage.setItem("cartes", JSON.stringify(cartes));
}

function getCarte() {
  let cartes = JSON.parse(localStorage.getItem("cartes")) || [];
  return cartes;
}

openCart.addEventListener("click", function () {
  dailog.classList.remove("hidden");
  displayCart();
  calculTotal();
});

closeCart.addEventListener("click", function () {
  dailog.classList.add("hidden");
});

async function addProducts() {
  try {
    let cartes = getCarte();
   // console.log(cartes);

    const products = await getData();
    console.log(products);
    const addButton = productContainer.querySelectorAll("button");
    const inputQuantite = productContainer.querySelectorAll("input");

    inputQuantite.forEach((input) => {
      input.addEventListener("input", function () {
        console.log(input.value);

        addButton.forEach((button) => {
          button.addEventListener("click", function (event) {
            let buttonid = event.target.getAttribute("id");
            console.log(buttonid);
            products.forEach((element) => {
              element.quantite = Number(input.value);
              if (buttonid == element.id) {
                if (element.stock <= 0) {
                  Swal.fire("Stock est  insefussunt");
                  return;
                }
                if (element.quantite > element.stock) {
                  Swal.fire("Stock épuisé");
                  return;
                }
                let newCarte = cartes.find((item) => item.id == buttonid);
                if (!newCarte) {
                  cartes.push(element);
                  saveCarte(cartes);
                } else {
                  newCarte.quantite = Number(input.value) + newCarte.quantite;
                  saveCarte(cartes);
                }
              }
            });
          });
        });

        //
      });
    });
  } catch (error) {
    console.log(error.massage);
  }
}

function displayCart() {
  let  cartes = getCarte();
 // console.log(cartes);

  if (cartes.length == 0) {
    productCarte.innerHTML = `<p> le panier est vide.</p>`;
    return;
  }
 productCarte.innerHTML ="";
  cartes.forEach((element) => {
    let sousTotal = element.quantite * element.price;
    
  
   
    let newStock = element.stock - element.quantite;

    productCarte.innerHTML += `<div class="flex flex-col sm:flex-row border border-gray-200 rounded-xl p-5 gap-5 w-full bg-white shadow-sm">
                <div class="w-full sm:w-1/4">
                <img src=http://localhost:3000${element.image}  class="w-full h-40 object-contain rounded-lg">
                 </div>
           <div  class="flex flex-col justify-center gap-2 flex-1">
              <h3 class="text-lg font-bold text-gray-800">${element.name}</h3>
                 <p> <span class="text-sm text-gray-600"> price :  </span>${element.price} $</p>
                <p> <span class="text-sm text-gray-600"> stock :  </span> ${newStock}</p>
                <p> <span class="text-sm text-gray-600"> quantite :  </span> ${element.quantite}</p>
               <p > <span class="text-sm text-gray-600"> Category :  </span> ${element.categoryName}</p>
                
           </div>
            
            <div  class="flex flex-col justify-between gap-3 sm:w-1/4">
                
               <button class="border border-orange-300 text-orange-500 rounded-lg px-3 py-2 text-sm">Panding</button>
                
               <h4 class="text-xl font-bold text-gray-800 ">${sousTotal} $</h4>
                   <div class="flex items-center gap-2">
                    <button class="border rounded-lg px-3 py-1">+</button>
                   <input type="number" min="1" value="" max="${element.stock}" class="border rounded-lg w-10 text-center py-1">
                    <button class="border rounded-lg px-3 py-1">-</button>
                 </div>
                <button  id=${element.id}  class="border border-red-300 text-red-600 rounded-lg px-3 py-2">remove</button>
                
            </div>
           </div>
         </div>`;
  });
 
 calculTotal();
  
}

function calculTotal(){
  let cartes = getCarte();
  let sousTotal = 0;
  let Total = [];
  let somme = 0;
 // console.log(cartes);
 if (cartes.length == 0) {
  cartTotal.textContent = 0;
  return;
 }
  cartes.forEach((element)=>{
    sousTotal = element.quantite * element.price;
      Total.push(sousTotal);
  })
 // console.log(Total);
  Total.forEach(element=>{
    somme = somme + element;

  })
  
  console.log(somme);
  cartTotal.textContent = somme;
}

productCarte.addEventListener('click', function(event){
  let buttonid = event.target.getAttribute("id");
  removeFromCart(buttonid)
})

 function removeFromCart(id){
  let cartes = getCarte();
  
  
  let carte =cartes.filter((item)=> item.id != id);
  
 console.log(carte);
 calculTotal();
 saveCarte(carte);
 displayCart();

 }

closeCarte.addEventListener('click', function(){
  let cartes = getCarte();
  console.log(closeCart);
  cartes =[];
  saveCarte(cartes);
  calculTotal();
  displayCart();
  
})

Reservation.addEventListener('click', function () {
  diolog2.classList.remove("hidden");
})
input.forEach(inpute=>{
inpute.addEventListener('input', function () {
//console.log(inpute.value);
if (inpute.value == "") {
  Swal.fire("Remplere les choix");
  return;
}

let information =[];
information.push(inpute.value);

console.log(information);
  })
})


  
 
  
  

  






