import "./import/dialog.js";
import { html } from "./import/utils.js";

/**
 * @typedef {import('../../types/db.d.ts').PizzaAndTopping} PizzaAndTopping
 * @typedef {import('../../types/db.d.ts').Pizza} Pizza
 * @typedef {import('../../types/db.d.ts').Topping} Topping
 */

class Pizze extends HTMLElement {
  /** @type {{ [key: Pizza["name"]]: Topping["name"][] }} */
  pizze = {};

  constructor() {
    super();
  }

  connectedCallback() {
    Promise.all([
      this.fetchTable("pizzas_and_toppings"),
      this.fetchTable("pizzas"),
      this.fetchTable("toppings"),
    ]).then(
      (
        /** @type {[PizzaAndTopping[], Pizza[], Topping[]]} */ [
          pizzas_and_toppings,
          pizzas,
          toppings,
        ]
      ) => {
        this.pizze = pizzas_and_toppings.reduce((acc, item) => {
          const pizza = pizzas.find((subItem) => subItem.id === item.pizza_id);
          const topping = toppings.find(
            (subItem) => subItem.id === item.topping_id
          );

          if (pizza?.name && topping?.name) {
            acc[pizza.name] = acc[pizza.name] || [];

            acc[pizza.name].push(topping.name);
          }

          return acc;
        }, {});

        this.render();
      }
    );
  }

  render() {
    this.innerHTML = html`
      <ul>
        ${Object.entries(this.pizze)
          .map(
            ([name, toppings]) => html`<li>
              <h2>${name}</h2>

              <custom-dialog>
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

  async fetchTable(table) {
    const data = await fetch(
      `https://vfqytfnobaqwcmqqnijb.supabase.co/rest/v1/${table}?select=*`,
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
