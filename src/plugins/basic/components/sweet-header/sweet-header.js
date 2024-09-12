class SweetHeader extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        //通过属性获取等级
        let level = parseInt(this.getAttribute('level') || "1");
        if (level < 1 || level > 6) {
            level = 1;
        }
        shadow.innerHTML = `
            <style>
                h1 {
                    color: var(--h1-color);
                    font-size: 2rem;
                    font-family: sans-serif;
                    text-align: center;
                }
            </style>
            <h${level}>
                <slot></slot>
            </h${level}>
        `;

    }
    connectedCallback() {

    }

}

// 注册自定义元素
customElements.define('sweet-header', SweetHeader);
