const api = {
  async fetchCities(codeDepartement = 59) {
    // fetch permet de faire une requête HTTP sans recharger la page
    // me permet d'appeler l'API de l'adresse fournie
    // Par défaut la méthode fetch() effectue une requête GET

    // On récupère une réponse de l'API
    const response = await fetch(`https://geo.api.gouv.fr/communes?codeDepartement=${codeDepartement}`);

    // Dans cette réponse, on va chercher à récupérer le contenu JSON
    const cities = await response.json();

    return cities;
  }
}

export default api;
