import citiesService from './services/cities.js';

const app = {
  init() {
    app.addEventListeners();
  },
  addEventListeners() {
    // On récupère le formulaire
    const departmentSearchFormElm = document.querySelector('#departmentSearchForm');
    // console.log(departmentSearchFormElm);

    // On écoute l'événement submit
    departmentSearchFormElm.addEventListener('submit', app.handleFormSubmit);
  },

  async handleFormSubmit(event) {
    // On annule le comportement par défaut du formulaire
    event.preventDefault();

    // On va vouloir récupérer les données du formulaire
    // On utilise FormData pour récupérer les données du formulaire
    // En lui passant l'élément HTML du formulaire
    const formData = new FormData(event.currentTarget);
    // Pour transformer FormData en objet classique
    const data = Object.fromEntries(formData);

    // On va appeler la méthode getCities du service citiesService
    try {
      const cities = await citiesService.getCities(data.search);
      const cityListElm = document.querySelector('#cityList');

      // On va vider la liste des villes
      cityListElm.textContent = '';

      for (const city of cities) {
        const cityElm = app.createCityItemElm(city);
        cityListElm.appendChild(cityElm);
      }
    } catch (error) {
      alert(error.message);
    }
  },

  createCityItemElm(city) {
    // On récupère le template
    const templateElm = document.querySelector('#cityItemTemplate');
    // console.log(templateElm);

    // Et on le clone le contenu du template
    const cityFragmentElm = templateElm.content.cloneNode(true);
    // console.log(cityFragmentElm);

    // Je vais maintenant remplir les données du fragment
    const cityDescriptionElm = cityFragmentElm.querySelector('.cities__item-description');
    cityDescriptionElm.textContent = `${city.code} ${city.nom}: ${city.population} habitants`;

    // On va pouvoir ajouter un écouteur sur le bouton
    const btnToggleElm = cityFragmentElm.querySelector('button.toggle');

    btnToggleElm.addEventListener('click', app.handleClickBtnCity);

    return cityFragmentElm;
  },

  handleClickBtnCity(event) {
    // Je récupère l'élément sur lequel j'ai cliqué
    const btnElm = event.currentTarget;

    // Je vais chercher mon `li` parent
    // MDN : https://developer.mozilla.org/fr/docs/Web/API/Element/closest
    const cityItemElm = btnElm.closest('.cities__item');

    // console.log(cityItemElm);

    cityItemElm.classList.toggle('cities__item--active');
    // cityItemElm.classList.add('cities__item--active');
    // cityItemElm.classList.remove('cities__item--active');
  },
};

app.init();
