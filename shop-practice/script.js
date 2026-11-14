const productContainer = document.getElementById("product-container");
const categerySelect = document.getElementById("category");
const serchInput = document.getElementById("serch");
const maxPriceInput = document.getElementById('max-price');
 const stock =document.getElementById('in-stock');
const API_BASE = "http://localhost:3000/api";

data();
createCtegery();
inStock();
async function getData() {
  const response = await fetch(API_BASE +'/products');

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
  };




async function getCategory() {
    try {
        const response = await fetch(API_BASE +"/categories");
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
    
         if (category == 'choisir category') {
            return ;
         }
      
        let url = await fetch( `${API_BASE}/products?categoryId=${category}`);
        console.log(url.status);
        
        let filteredProduct =await url.json();
        afficheData(filteredProduct);

  };

 async function filterDataMaxPrice(maxPrice){
    
        let url = await fetch(`${API_BASE}/products?maxPrice=${maxPrice}`);
        console.log(url.status);
        let filtredProduct = await url.json();
        console.log(filtredProduct);
        afficheData(filtredProduct);
        
    }

async function inStock() {
stock.addEventListener('change', async function (event) {
   console.log(event.target.checked);
       let chek = event.target.checked;
    if (chek == false) {
    return;
     }
      
        let url = await fetch(`${API_BASE}/products?inStock=${chek}`);
      console.log(url.status);
       let productInStock = await url.json();
      afficheData(productInStock);
       
})

    }
 


 serchInput.addEventListener("input", function () {
  serchProducts(serch.value);
 
 })
    
 categerySelect.addEventListener("change", function () {
    filterProductsParCategory(category.value);
     })

 maxPriceInput.addEventListener('input', function () {
   filterDataMaxPrice(maxPriceInput.value);
     })


     const params = new URLSearchParams();
     params.appendChild("categoryId")
     params.appendChild("search")
     params.appendChild("maxPrice")
     params.appendChild("inStock")
      