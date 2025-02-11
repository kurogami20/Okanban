import api from "./api.js";

const app = {
  async init() {
    await app.listHandler();
  },

  async listHandler() {
    const characters = await api.towns();
    const listElm = document.querySelector("#list");
    characters.forEach((char) => {
      const liElm = document.createElement("li");
      liElm.textContent = char.name;
      listElm.appendChild(liElm);
    });
  },
};
app.init();
