 function populateUFs () {
     const ufSelect = document.querySelector("select[name=uf]")

     fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
     .then( res => res.json() )
     .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }

     })
 }

 populateUFs ()


 function getCities(event) {
    const citySelect = document.querySelector("[name=city]")
    const stateInput = document.querySelector("[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text


    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios` 
 
    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then( cities => {
       
      for( const city of cities ) {
           citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
       }  
       
       citySelect.disabled = false
    })
 }


 document
    .querySelector ("select[name=uf]")
    .addEventListener("change", getCities)

// Itens de Coleta!
const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect) {
   item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
   const itemLi = event.target

   //Adicionar ou Remover uma classe com Javascript
   itemLi.classList.toggle("selected")

   const itemId = itemLi.dataset.id

   //console.log('ITEM ID: ', itemId)

   //Verificar se existem itens selecionados, se sim, o sistema deve pegar os itens selecionados!

   const alreadySelected = selectedItems.findIndex( item => {
      const itemFound = item == itemId // Isso será True ou False!
      return itemFound
   })

   //Se já estiver selecionado, o sistema deve remover a seleção!
   if ( alreadySelected >= 0 ) {
      const filteredItems = selectedItems.filter( item => {
         const itemIsDifferent = item != itemId
         return itemIsDifferent
      })

      selectedItems = filteredItems
   
   //Se não estiver selecionado, o sistema deve adicionar à seleção!
   } else {
      selectedItems.push(itemId)
   }
 
   //console.log('selectedItems:', selectedItems)

   //O sistema deve atualizar o campo escondido com os itens selecionados!
   collectedItems.value = selectedItems
}