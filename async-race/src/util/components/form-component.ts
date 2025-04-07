import { BaseComponent, type IBaseComponentParam } from "../base-component";

export class FormComponent extends BaseComponent {
    constructor(baseParam: IBaseComponentParam) {
        const param: IBaseComponentParam = {
            tag: "form",
            classList: baseParam.classList,
        };
        super(param);
        this.addComponentEventListener("submit", (e) =>
            this.addPreventDefaultEvent(e)
        );
    }

    private addPreventDefaultEvent(e: Event) {
        e.preventDefault();
    }
}
