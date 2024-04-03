import "./import/dialog.js";
import { html } from "./import/utils.js";

/**
 * @typedef {import('../../types/db.d.ts').PizzaAndTopping} PizzaAndTopping
 * @typedef {import('../../types/db.d.ts').Pizza} Pizza
 * @typedef {import('../../types/db.d.ts').Topping} Topping
 */

class Pizze extends HTMLElement {
  /** @type {{ [key: Pizza["name"]]: Topping["name"][] }} */
  pizzas = {};

  constructor() {
    super();
  }

  connectedCallback() {
    this.fetch().then((data) => {
      this.pizzas = data.reduce((acc, item) => {
        const { pizza, topping } = item;

        if (pizza?.name && topping?.name) {
          acc[pizza.name] = acc[pizza.name] || [];

          acc[pizza.name].push(topping.name);
        }

        return acc;
      }, {});

      this.render();
    });
  }

  render() {
    this.innerHTML = html`
      <ul>
        ${Object.entries(this.pizzas)
          .map(
            ([name, toppings]) => html`<li>
              <h2>${name}</h2>

              <custom-dialog data-button-text="Details">
                <h1>${name}</h1>
                <ul>
                  ${toppings
                    .map((topping) => html`<li>${topping}</li>`)
                    .join("")}
                </ul>
              </custom-dialog>
            </li>`
          )
          .join("")}
      </ul>
    `;
  }

  /**
   * @returns {Promise<PizzaAndTopping[]>}
   */
  async fetch() {
    const data = await fetch(
      `https://vfqytfnobaqwcmqqnijb.supabase.co/rest/v1/pizzas_and_toppings?select=id,pizza:pizzas(id,name),topping:toppings(id,name)`,
      {
        headers: {
          apikey: String(window.env.SUPABASE_ANON_TOKEN),
          Authorization: `Bearer ${window.env.SUPABASE_ANON_TOKEN}`,
        },
      }
    ).then((response) => response.json());

    return data;
  }
}

customElements.define("custom-pizze", Pizze);
