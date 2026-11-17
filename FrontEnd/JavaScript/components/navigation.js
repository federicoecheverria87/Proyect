
export function redirectToIndex() {

    setTimeout(() => {
      window.location.href = "../Index.html";
    }, 1000);
}

export function redirectToLogin() {

    setTimeout(() => {
      window.location.href = "Login.html";
    }, 1000);
}

export function redirectToHome() {

    setTimeout(() => {
      window.location.href = "Home.html";
    }, 1000);
}

export function redirectToNewProduct(){
  window.location.href = `Product.html`;
}

export function redirectToEditProduct(id){
  window.location.href = `Product.html?id=${id}`;
}

export function redirectToProductDetail(id){
  window.location.href = `Product_Detail.html?id=${encodeURIComponent(id)}`;
}

export function redirectToEditUser(id){
  window.location.href = `EditUser.html?id=${id}`;
}