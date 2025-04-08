export interface IBaseComponentParam {
    tag?: string;
    classList?: string[];
    textContent?: string;
}

export enum IEvents {
    click = "click",
}

export class BaseComponent {
    protected component: HTMLElement | null;

    constructor(param: IBaseComponentParam = {}) {
        this.component = null;
        this.createBaseComponent(param);
    }

    public getElement(): HTMLElement | null {
        return this.component;
    }

    public appendChildren(children: (HTMLElement | null)[]): void {
        children.forEach((child) => {
            if (this.component && child) {
                this.component.append(child);
            }
        });
    }

    public appendChildComponents<T extends BaseComponent>(
        childComponents: T[]
    ): void {
        childComponents.forEach((childComponent) => {
            const el = childComponent.getElement();
            if (this.component && el) {
                this.component.append(el);
            }
        });
    }

    public prependChildComponents<T extends BaseComponent>(
        childComponents: T[]
    ): void {
        childComponents.forEach((childComponent) => {
            const el = childComponent.getElement();
            if (this.component && el) {
                this.component.prepend(el);
            }
        });
    }

    public setComponentAttribute(
        attributeName: string,
        attributeValue: string
    ) {
        if (this.component) {
            this.component.setAttribute(attributeName, attributeValue);
        }
    }

    public removeComponentAttribute(attributeName: string) {
        if (this.component) {
            this.component.removeAttribute(attributeName);
        }
    }

    public addComponentEventListener(
        eventName: string,
        callback: (ev: Event) => void
    ): void {
        if (this.component) {
            this.component.addEventListener(eventName, (e) => {
                callback(e);
            });
        }
    }

    public removeComponent(): void {
        if (this.component) {
            this.component.remove();
        }
    }

    public removeChildren(): void {
        if (this.component) {
            while (this.component.firstChild) {
                this.component.firstChild.remove();
            }
        }
    }

    public getParentComponent(): HTMLElement | null {
        if (this.component) {
            return this.component.parentElement;
        }
        return null;
    }

    public getNextSiblingElement(): Element | null {
        if (this.component) {
            return this.component.nextElementSibling;
        }
        return null;
    }

    public addClassIfHasNot(className: string): void {
        if (this.component && !this.hasClass(className)) {
            this.component.classList.add(className);
        }
    }
    public removeClass(className: string): void {
        if (this.component) {
            this.component.classList.remove(className);
        }
    }

    public hasClass(className: string): boolean {
        if (this.component) {
            return this.component.classList.contains(className);
        }
        return false;
    }

    protected createBaseComponent(param: IBaseComponentParam): void {
        this.component = document.createElement(param.tag ?? "div");
        if (param.classList) {
            this.setCSSClasses(param.classList);
        }
        if (param.textContent) {
            this.setTextContent(param.textContent);
        }
    }

    protected setCSSClasses(classList: string[]): void {
        classList.forEach((str: string) => {
            if (this.component && str) {
                this.component.classList.add(str);
            }
        });
    }

    protected setTextContent(textContent: string): void {
        if (this.component) {
            this.component.textContent = textContent;
        }
    }

    protected setCallback(
        eventName: IEvents,
        callback: (e: Event) => void
    ): void {
        if (this.component) {
            this.component.addEventListener(eventName, (event) =>
                callback(event)
            );
        }
    }
}
