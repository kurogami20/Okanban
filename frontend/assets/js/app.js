import listFetcher from "./API/listFetcher.js";
import cardFetcher from "./API/cardFetcher.js";
import Sortable from "sortablejs";

// test sortable

const app = {
  init() {
    app.addListToggle();
    app.listHandler();
    app.cardHandler();
  },
  // *ouvrir la fenetre d'ajout de liste
  addListToggle() {
    function eventlistener() {
      //* ajout d'une liste event
      // ouverture de la modal
      const addListElem = document.querySelector("#add-list-button");
      addListElem.addEventListener("click", toggleNewList);
      // fermeture de la modal
      const closeElems = document.querySelectorAll(".close");
      closeElems.forEach((close) => {
        close.addEventListener("click", closeToggleNewList);
      });
    }

    function toggleNewList(event) {
      event.preventDefault();
      const listNb = document.querySelectorAll(".list_template-item");
      const modalformElem = document.querySelector("#add-list-modal");
      const positionElem = modalformElem.querySelector("#add-list-position");
      positionElem.max = `${listNb.length}`;
      modalformElem.showModal();
    }

    function closeToggleNewList(event) {
      event.preventDefault();
      const modalformElem = document.querySelector("#add-list-modal");

      modalformElem.close();
    }

    return eventlistener();
  },

  async listHandler() {
    const listData = await listFetcher.allList();

    const main = document.querySelector("#lists-container");

    // * aficher les listes créée

    function listElmCreate(list) {
      const listTemplate = document.querySelector("#list_template");
      const listTemplateFrag = listTemplate.content.cloneNode(true);
      const container = listTemplateFrag.querySelector(".list_template-item");
      const listTitleElm = listTemplateFrag.querySelector(".list_title");
      listTitleElm.textContent = `${list.name}`;
      container.dataset.id = list.id;
      container.dataset.position = list.position;

      return listTemplateFrag;
    }
    function generateList() {
      listData.forEach((li) => {
        const listElem = listElmCreate(li);
        main.appendChild(listElem);
      });
      // const tab = listData.map((li) => {
      //     listElmCreate(li)

      // });
      // console.log(tab)
      //  main.append(...tab)
    }
    // * ajout de liste
    function addListHandler() {
      const formList = document.querySelector("#form-list");
      formList.addEventListener("submit", formSubmit);

      async function formSubmit(event) {
        event.preventDefault();

        const modalformElem = document.querySelector("#add-list-modal");
        modalformElem.close();

        const formContent = new FormData(event.currentTarget);
        const dataContent = Object.fromEntries(formContent);
        console.log(dataContent);

        main.appendChild(listElmCreate(dataContent));

        if (dataContent.position === "") {
          await listFetcher.addList({ name: dataContent.name });
        } else {
          const positionNumber = Number.parseInt(dataContent.position);
          const realPosition = positionNumber - 1;
          await listFetcher.addList({
            name: dataContent.name,
            position: realPosition,
          });
        }

        modalformElem.reset();
      }
    }

    function UpdateList() {
      //* création et mise en palace d'un menu pour les liste
      function listMenu() {
        const modifyBtnElm = document.querySelectorAll(".listModifBtn");
        modifyBtnElm.forEach((btn) => {
          btn.addEventListener("click", toggleMenuModifList);
        });

        function toggleMenuModifList(event) {
          event.preventDefault();
          const dropdownElm = event.currentTarget.closest(".dropdown ");

          dropdownElm.classList.toggle("is-active");
        }
      }

      // *ajout des modales spécifiques
      function modify() {
        // *comportement de la modale

        const main = document.querySelector("#lists-container");
        Sortable.create(main, {
          onEnd: (evt) => {
            const positionNum = Number.parseInt(evt.newIndex);
            const id = evt.clone.dataset.id;
            const objectToSend = { id: id, position: positionNum };
            console.log(objectToSend);
            updateListDrag(objectToSend);
          },
        });
        async function updateListDrag(data) {
          await listFetcher.updateList(data);
        }

        function modaleBehavior() {
          const modifyElm = document.querySelectorAll(".modify-dropdown");
          modifyElm.forEach((elm) => {
            elm.addEventListener("click", modalAppear);
          });
          const closeElems = document.querySelectorAll(".close");
          closeElems.forEach((close) => {
            close.addEventListener("click", closeModal);
          });
          function modalAppear(event) {
            event.preventDefault();
            const listNb = document.querySelectorAll(".list_template-item");
            const modaleElem = document.querySelector("#modify-list-modal");
            const positionElem = modaleElem.querySelector(
              "#modify-list-position"
            );
            positionElem.setAttribute("max", `${listNb.length}`);

            modaleElem.showModal();
          }

          function closeModal(event) {
            event.preventDefault();
            const modalformElem = document.querySelector("#modify-list-modal");

            modalformElem.close();
          }
        }

        function formHandler() {
          function idGetter() {
            const modifyElm = document.querySelectorAll(".modify-dropdown");
            modifyElm.forEach((elm) => {
              elm.addEventListener("click", getId);
            });
            async function getId(event) {
              const btnElem = event.currentTarget;
              const parentElm = btnElem.closest(".list_template-item");
              const id = parentElm.dataset.id;
              const modfyFormElem =
                document.querySelector("#form-list-updater");
              const idInputElm = modfyFormElem.querySelector("#modify-list-id");
              idInputElm.value = `${id}`;
            }
          }
          function sendData() {
            const formList = document.querySelector("#form-list-updater");
            formList.addEventListener("submit", formSubmit);

            async function formSubmit(event) {
              event.preventDefault();

              const modalformElem =
                document.querySelector("#modify-list-modal");
              modalformElem.close();

              const formContent = new FormData(event.currentTarget);
              const dataContent = Object.fromEntries(formContent);
              const positionToNum = Number.parseInt(dataContent.position);
              const realPosition = positionToNum - 1 || "";
              console.log({ ...dataContent, position: realPosition });
              if (dataContent.name !== "" && realPosition !== "") {
                const data = { ...dataContent, position: realPosition };
                await listFetcher.updateList(data);
              } else if (dataContent.name === "" && realPosition !== "") {
                const data = { id: dataContent.id, position: realPosition };
                await listFetcher.updateList(data);
              } else if (dataContent.name !== "" && realPosition === "") {
                const data = { id: dataContent.id, name: dataContent.name };
                await listFetcher.updateList(data);
              } else {
                await listFetcher.updateList();
              }

              modalformElem.reset();
            }
          }

          idGetter();
          sendData();
        }

        modaleBehavior();
        formHandler();
      }
      function toDelete() {
        // *comportement de la modale
        function modaleBehavior() {
          const modifyElm = document.querySelectorAll(".delete-dropdown");
          modifyElm.forEach((elm) => {
            elm.addEventListener("click", modalAppear);
          });
          const closeElems = document.querySelectorAll(".close");
          closeElems.forEach((close) => {
            close.addEventListener("click", closeModal);
          });
          function modalAppear(event) {
            event.preventDefault();
            const modaleElem = document.querySelector("#delete-list-modal");

            modaleElem.showModal();
          }

          function closeModal(event) {
            event.preventDefault();
            const modalformElem = document.querySelector("#delete-list-modal");
            modalformElem.close();
          }
        }
        modaleBehavior();

        function formHandler() {
          function idGetter() {
            const modifyElm = document.querySelectorAll(".delete-dropdown");
            modifyElm.forEach((elm) => {
              elm.addEventListener("click", getId);
            });
            function getId(event) {
              const btnElem = event.currentTarget;
              const parentElm = btnElem.closest(".list_template-item");
              const id = parentElm.dataset.id;
              const deleteFormElem =
                document.querySelector("#form-list-deleter");
              const inputElm = deleteFormElem.querySelector("#cardIdToDelete");
              inputElm.value = `${id}`;
              console.log(id);
            }
          }

          function sendData() {
            const formList = document.querySelector("#form-list-deleter");
            formList.addEventListener("submit", formSubmit);

            async function formSubmit(event) {
              event.preventDefault();

              const modalformElem =
                document.querySelector("#delete-list-modal");
              modalformElem.close();

              const formContent = new FormData(event.currentTarget);
              const { id } = Object.fromEntries(formContent);
              console.log(id);
              const listElm = document.querySelector(`[data-id="${id}"]`);
              listElm.remove();
              await listFetcher.deleteList(id);

              modalformElem.reset();
            }
          }

          idGetter();
          sendData();
        }
        formHandler();
        listMenu();
        modify();
      }

      modify();
      toDelete();
    }

    // *renvoie des fonction

    generateList();
    UpdateList();
    addListHandler();
  },

  // * aficher les carte créée dans leur liste
  async cardHandler() {
    const listData = await listFetcher.allList();
    const main = document.querySelector("#lists-container");
    const plusElm = main.querySelector(".card_plus");

    function generateCard() {
      const listElmSec = document.querySelectorAll(".list_template-item");
      listElmSec.forEach(async (li) => {
        const classNumb = li.dataset.id;
        const toNum = Number.parseInt(classNumb);
        const cardPartElem = li.querySelector(".message-body");
        const cardsByList = await cardFetcher.allCardByList(toNum);
        cardsByList.forEach((ca) => {
          cardPartElem.prepend(cardElmCreate(ca));
        });
      });
    }

    function cardElmCreate(card) {
      const cardTemplate = document.querySelector("#card_template");
      const cardTemplateFrag = cardTemplate.content.cloneNode(true);
      const cardContainer = cardTemplateFrag.querySelector(".card");
      cardContainer.dataset.id = card.id;
      const cardTitleElm = cardTemplateFrag.querySelector(".card-header-title");
      const cardContentElm = cardTemplateFrag.querySelector(".card-content");
      cardTitleElm.textContent = `${card.name}`;
      cardContentElm.textContent = `${card.content}`;
      return cardTemplateFrag;
    }

    generateCard();
  },
};

app.init();
