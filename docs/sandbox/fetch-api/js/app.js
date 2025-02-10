import api from './api.js';

const app = {
  async init() {
    app.fetchCitiesFromDepartment(59);

    document.querySelector('form').addEventListener('submit', app.handleSubmit);
  },

  async fetchCitiesFromDepartment(departmentCode) {
    const cities = await api.fetchCities(departmentCode);

    // On va maintenant créer notre HTML à partir de ces données
    const cityListContainerElm = document.querySelector('#list');

    // On vide la liste avant de la remplir
    cityListContainerElm.innerHTML = '';

    cities.forEach(city => {
      const cityElm = document.createElement('li');
      cityElm.textContent = city.nom;
      cityListContainerElm.appendChild(cityElm);
    });
  },

  handleSubmit(event) {
    // On empêche le formulaire de recharger la page
    event.preventDefault();

    // On récupère la valeur du champ input
    const formData = new FormData(event.target);

    // On récupère la valeur du champ input
    const departmentCode = formData.get('departmentCode');

    app.fetchCitiesFromDepartment(departmentCode);
  }
}

app.init();
