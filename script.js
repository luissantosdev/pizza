let cart = [];
let modalqt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


pizzaJson.map((item, index)=>{
    let pizzaItem =c('.models .pizza-item').cloneNode(true);

     // prenchendo as infromações:
      pizzaItem.setAttribute('data-key',  index)
      pizzaItem.querySelector('.pizza-item--price').innerHTML =` R$${item.price.toFixed(2)}`;
      pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
      pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
      pizzaItem.querySelector('img').src = item.img ; 
      pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault()

        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalqt = 1;
        modalKey = key
        // prenchendo o madal
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--size.selected').classList.remove('selected')
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
           if(sizeIndex == 2){
              size.classList.add('selected')
           }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
            c('.pizzaInfo--actualPrice').innerHTML = `R$${pizzaJson[key].price.toFixed(2)}`
        })
          c('.pizzaInfo--qt').innerHTML = modalqt
        //colocando uma animação no modal
         c('.pizzaWindowArea').style.opacity = 0;
         c('.pizzaWindowArea').style.display = 'flex'
         setTimeout(()=>{
          c('.pizzaWindowArea').style.opacity = 1;
         },200)
      })
      // dicionando os itens na tela 
     c('.pizza-area').append(pizzaItem)
})


//eventos do modal

function closeModal(){
  c('.pizzaWindowArea').style.opacity = 0
  setTimeout(()=>{
     c('.pizzaWindowArea').style.display = 'none'
  },500)
}

cs('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=>{
 
  item.addEventListener('click', closeModal)
})

c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
  
  if(modalqt > 1){
    modalqt--
  }
   
  c('.pizzaInfo--qt').innerHTML = modalqt;

})
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
   modalqt++;
   c('.pizzaInfo--qt').innerHTML = modalqt
})

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',()=>{
      c('.pizzaInfo--size.selected').classList.remove('selected')
      size.classList.add('selected')

    })
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
  
  let size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
  
let verifater = pizzaJson[modalKey].id+'@'+size;

let key = cart.findIndex((item)=> item.verifater == verifater)


if(key > -1){
  cart[key].qt += modalqt
}else{
  cart.push({
    verifater: verifater,
    id:pizzaJson[modalKey].id,
    size,
    qt: modalqt
  })
}


  updateCar()
  closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length >= 1){
      c('aside').style.left = '0';
    }

    c('.menu-closer').addEventListener('click', ()=>{
      c('aside').style.left = '100vw'
    })
 
})
function updateCar(){
  c('.menu-openner span').innerHTML = cart.length

  if(cart.length > 0){
    c('aside').classList.add('show');
      c('.cart').innerHTML = ''

      let subTotal = 0;
      let desconto = 0;
      let total = 0;

    for(let i in cart){
      let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
      subTotal +=pizzaItem.price * cart[i].qt;
      
      let cartItem = c('.models .cart--item').cloneNode(true)
      let pizzaSizeName;
      switch(cart[i].size){
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M'
          break;

      case 2:
        pizzaSizeName = 'G'

        break;

        default:
            pizzaSizeName = 'G'
          break;


      }
      let pizzaName = `${pizzaItem.name} ${pizzaSizeName}`
      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name}  (${pizzaSizeName})`
      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
            if(cart[i].qt >1){
              cart[i].qt--
            }else{
              cart.splice(i,1)
            }

            updateCar()
      })

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
          cart[i].qt++
          updateCar()
      })

     c('.cart').append(cartItem)
    }


    desconto = subTotal * 0.1;
    total = subTotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$${subTotal.toFixed(2)}`
    c('.desconto span:last-child').innerHTML = `R$${desconto.toFixed(2)}`
    c('.total span:last-child').innerHTML = `R$${total.toFixed(2)}`
  }else{
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw'
  }
}