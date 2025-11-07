class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
        }

        .dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 4px solid #eee;
          border-top-color: var(--primary, #1976d2);
          animation: spin 0.9s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      </style>

      <div class="wrap" role="status" aria-live="polite">
        <div class="dot" aria-hidden="true"></div>
      </div>
    `;
  }
}

customElements.define('loading-indicator', LoadingIndicator);
export default LoadingIndicator;
