const cardFetcher = {

async allCard(){
const data = await fetch('http://localhost:3000/api/v1/card')
const cardData = await data.json()
return cardData
},
async allCardByList(id){
const data = await fetch(`http://localhost:3000/api/v1/card/list/${id}`)
const cardData = await data.json()
return cardData
},
}

export default cardFetcher