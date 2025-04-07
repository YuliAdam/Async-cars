import './button-child.css'
import { IBaseComponentParam } from "../../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../../util/components/button-component";

const CssClasses: { createRandom: string[] } = {
    createRandom: ["create_random"],
};

const CREATE_RANDOM_TEXT: string = "Generate cars";

export class CreateRandomComponent extends ButtonComponent {
    constructor() {
        const createRandomParam: IBaseComponentParam = {
            classList: CssClasses.createRandom,
            textContent: CREATE_RANDOM_TEXT,
        };
        super(createRandomParam);
    }
}
