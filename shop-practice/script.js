const productContainer = document.getElementById("product-container");
const categerySelect = document.getElementById("category");
const serchInput = document.getElementById("serch");
const maxPriceInput = document.getElementById("max-price");
const stock = document.getElementById("in-stock");
const resetfilters = document.getElementById('reset-filters');
const API_BASE = "http://localhost:3000/api";

data();
createCtegery();
inStock();
//filtredProduct();
async function getData() {
  const response = await fetch(API_BASE + "/products");

  if (!response.ok) {
    const problem = await response.json();
    console.log(problem.message);
    return;
  }
  const products = await response.json();
  return products;
}

async function data() {
  const products = await getData();
  console.log(products);
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

    productContainer.innerHTML += `<div id=${element.id} class="border  rounded-xl w-1/4">
                <div class="w-full">
                    <img src= http://localhost:3000${element.image}>
                </div>
                <div class="pl-10 pr-10 pb-3 pt-3">
                <h3 class=" text-[20px] font-bold ">${element.name} </h3>
                <p> ${element.description}</p>
                <p> <span class="text-gray-600"> price :  </span> ${element.price} $</p>
                <p> <span class="text-gray-600"> stock :  </span>${element.stock} </p>
                <p>${element.categoryName}</p>
                <button class="border rounded-lg w-full bg-blue-200">Add Product</button>
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
    let url =  await fetch(`${API_BASE}/products`);
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
   filtredProduct()
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
    
    const response = await fetch(`${API_BASE}/products?${params}`)
    const products = await response.json();
    afficheData(products);
}
   catch (error) {
    console.log(error.message);
    productContainer.innerHTML = `<h3>Aucun products.</h3>`

  }
 }

 resetfilters.addEventListener('click', function(){
   categerySelect.value = "";
   maxPriceInput.value = "";
   stock.checked = false;
   data();
 })
