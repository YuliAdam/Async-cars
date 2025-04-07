import "./form-create-random.css";
import { IBaseComponentParam } from "../../../../../../../util/base-component";
import { FormComponent } from "../../../../../../../util/components/form-component";

import { CreateRandomComponent } from "./button-child/button-child";

const CssClasses: { createForm: string[] } = {
    createForm: ["update-garage_random"],
};

export class CreateRandomView extends FormComponent {
    constructor() {
        const createFormParam: IBaseComponentParam = {
            classList: CssClasses.createForm,
        };
        super(createFormParam);
        this.configComponent();
    }

    private configComponent(): void {
        this.appendChildComponents([this.createChildrenComponents()]);
    }

    private createChildrenComponents(): CreateRandomComponent {
        return new CreateRandomComponent();
    }
}
