const api = {
  async towns() {
    const starwarsCharApi = await fetch("https://swapi.dev/api/people");
    const starwarsCharList = await starwarsCharApi.json();

    console.log(starwarsCharList.results);

    return starwarsCharList.results;
  },
};
export default api;
