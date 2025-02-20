const citiesService = {
  async getCities(departmentCode = 59) {
    const response = await fetch(`https://geo.api.gouv.fr/communes?codeDepartement=${departmentCode}`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: Failed to fetch cities`);
    }

    const data = await response.json();

    return data;
  },
};

export default citiesService;
