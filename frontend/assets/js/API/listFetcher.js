import { apiBaseURL } from "./config"

const listFetcher = {

async allList(){
const data = await fetch(`${apiBaseURL}/api/v1/list`)
const listData = await data.json()
return listData
},
async addList(data){
const httpResponse = await fetch(`${apiBaseURL}/api/v1/list`, {
  method: "POST", // je cible la route `POST`
  headers: { "Content-Type": "application/json" }, // je préviens que j'envoie du JSON
  body: JSON.stringify(data), // j'envoie mes données en JSON
});
const dataAdded = await httpResponse.json();
console.log(dataAdded); // Les données JSON renvoyées par l'API récupérées en objet JS
},

async updateList(data){
const httpResponse = await fetch(`${apiBaseURL}/api/v1/list/${data.id}`, {
  method: "PATCH", // je cible la route `POST`
  headers: { "Content-Type": "application/json" }, // je préviens que j'envoie du JSON
  body: JSON.stringify(data), // j'envoie mes données en JSON
});
const dataAdded = await httpResponse.json();
console.log(dataAdded); // Les données JSON renvoyées par l'API récupérées en objet JS
},
async deleteList(id){
  const httpResponse = await fetch(`${apiBaseURL}/api/v1/list/${id}`, {
  method: "DELETE", // je cible la route `POST`

});
const dataAdded = await httpResponse.json();
console.log(dataAdded); 
}

}

export default listFetcher