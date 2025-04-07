import { BaseComponent, type IBaseComponentParam } from "../base-component";

export class ButtonComponent extends BaseComponent {
    constructor(baseParam: IBaseComponentParam) {
        const param: IBaseComponentParam = {
            tag: "button",
            classList: baseParam.classList,
            textContent: baseParam.textContent,
        };
        super(param);
    }
}
