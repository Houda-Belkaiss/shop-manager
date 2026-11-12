const productContainer = document.getElementById("product-container");

async function getData() {
  const response = await fetch("http://localhost:3000/api/products");

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
data();

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

async function serchProducts() {
  const serchInput = document.getElementById("serch");
  serchInput.addEventListener("input", async function () {
    let serchValue = serchInput.value;
    console.log(serchValue);

    try {
      let url = await fetch(
        `http://localhost:3000/api/products?search=${serchValue}`,
      );
      console.log(url.status);
      let productSearch = await url.json();
     //console.log(productSearch);
      
      if (productSearch.length == 0) {
        productContainer.innerHTML = `<p>Aucun résultat trouvé.</p>`;
        return;
      }

      afficheData(productSearch);
    } catch (error) {
      console.log(error.message);
      productContainer.innerHTML = `<h3>Aucun résultat.</h3>`;
    }
  });
}

serchProducts();

async function getCategory() {
    try {
        const response = await fetch("http://localhost:3000/api/categories");
       const category = await response.json();
        return category;
    } catch (error) {
        console.log(error.message);
    }
  
}

const categerySelect = document.getElementById("category");



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

 function filterProductsParCategory() {
    
  categerySelect.addEventListener("change",  async function () {
         //  console.log(categerySelct.value); 
         if (categerySelect.value == 'choisir category') {
            
            return ;
         }
      let categoryId = categerySelect.value;
        let url = await fetch( `http://localhost:3000/api/products?categoryId=${categoryId}`);
        // console.log(url.status);
        let filteredProduct =await url.json();
      //  console.log(filteredProduct);
        afficheData(filteredProduct);
  
   
  });
}

createCtegery();
filterProductsParCategory();


function filterDataMaxPrice(){
    const maxPriceInput = document.getElementById('max-price');
    
    
    maxPriceInput.addEventListener('input',async function () {
        let maxPrice = maxPriceInput.value;
       // console.log(maxPrice);
        let url = await fetch(`http://localhost:3000/api/products?maxPrice=${maxPrice}`);
        console.log(url.status);
        let filtredProduct = await url.json();
       // console.log(filtredProduct);
        afficheData(filtredProduct);
        
        
    })
}
filterDataMaxPrice();

function inStock() {
  const stock =document.getElementById('in-stock');
  try {
     stock.addEventListener('change', async function (event) {
    let cheked = event.target.checked;
    if (cheked == true) {
       let url = await fetch(`http://localhost:3000/api/products?inStock=${cheked}`);
      //  console.log(url.status);
        let productInStock = await url.json();
       // console.log(filtredProduct);
        afficheData(productInStock);
    }
  })
  } catch (error) {
    console.log(error.message);
    
  }
  
  }
  
inStock();


    