import { html } from "./utils.js";

class Dialog extends HTMLElement {
  /** @type {HTMLDialogElement | null} */
  dialog = null;

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = html`
      <button type="button" data-open>Details</button>
      <dialog>
        <button type="button" data-close>Close</button>
        ${this.innerHTML}
      </dialog>
    `;

    this.dialog = this.querySelector("dialog");

    this.addEventListener("click", (event) => {
      const element = /** @type {HTMLElement} */ (event.target);

      if (element.matches("[data-open")) {
        this.dialog?.showModal();
      } else if (element.matches("[data-close")) {
        this.dialog?.close();
      }
    });
  }
}

customElements.define("custom-dialog", Dialog);
