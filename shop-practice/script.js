 const productContainer = document.getElementById('product-container');
 
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
        productContainer.innerHTML= "Impossible de charger les produits. Veuillez réessayer";
        return;
        
    }
   
     afficheData(products);
      // serchProducts(products);

 }
  data();

   function afficheData(products) {
       productContainer.innerHTML = "";
         if (products.length == 0) {
                productContainer.innerHTML = `<h3 class=" text-[15px] font-bold "> Aucun produit disponible pour le moment.</h3>`
                return;
            }

             products.forEach(element => {
          
           // console.log(element);
           //' console.log(element.image);
            
            productContainer.innerHTML += `<div id=${element.id} class="border  rounded-xl w-1/4">
                <div class="w-full">
                    <img src= http://localhost:3000${element.image}>
                </div>
                <div class="pl-10 pr-10 pb-3 pt-3">
                <h3 class=" text-[15px] font-bold ">${element.name} </h3>
                <p> ${element.description}</p>
                <p> <span class="text-gray-600"> price :</span>${element.price}</p>
                <p> <span class="text-gray-600"> stock :</span>${element.stock}</p>
                <p>${element.categoryName}</p>
                <button class="border rounded-lg w-full bg-blue-200">Add Product</button>
            </div>
             </div>`

            
        });
    }
   

   



   async function serchProducts() {
     const serchInput = document.getElementById('serch');
     serchInput.addEventListener('input',async function (event) {
         let serchValue = serchInput.value;
            console.log(serchValue);
           
           try {
            let url = await fetch(`http://localhost:3000/api/products?search=${serchValue}`);
            console.log(url.status);
            let productSearch = await url.json();
            if (productSearch.length == 0) {
                 productContainer.innerHTML = `<p>Aucun résultat trouvé.</p>`;
                 return;
            }

            afficheData(productSearch);
           } catch (error) {
            console.log(error.message);
            productContainer.innerHTML = `<h3>Aucun résultat.</h3>`
            
           
         } 
          
       })
        
    }

 serchProducts();