import { BaseComponent, type IBaseComponentParam } from "../base-component";

export interface IInputParam {
    type: string;
}

export class InputComponent extends BaseComponent {
    constructor(baseParam: IBaseComponentParam, inputParam: IInputParam) {
        const param: IBaseComponentParam = {
            tag: "input",
            classList: baseParam.classList,
        };
        super(param);
        this.configurateComponent(inputParam);
    }

    private configurateComponent(inputParam: IInputParam) {
        this.setType(inputParam.type);
    }

    private setType(type: string): void {
        if (this.component) {
            this.component.setAttribute("type", type);
        }
    }

    public setValue(value: string) {
        if (this.component instanceof HTMLInputElement) {
            this.component.value = value;
        }
    }
}
