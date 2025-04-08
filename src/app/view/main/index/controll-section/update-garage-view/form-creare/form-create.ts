import "./form-create.css";
import { type IBaseComponentParam } from "../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../util/components/button-component";
import { FormComponent } from "../../../../../../../util/components/form-component";
import { InputComponent } from "../../../../../../../util/components/input-component";
import { CreateFormChildren } from "./form-create-children/form-create-children";
import { Service } from "../../../../../../service/service";
import { GarageView } from "../../../garage-section/garage-view";
import { PaginationView } from "../../../pagination-section/pagination-view";
import { IndexView } from "../../../index-view";

const CssClasses: { createForm: string[] } = {
    createForm: ["update-garage_create"],
};

export class CreateFormView extends FormComponent {
    constructor(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ) {
        const createFormParam: IBaseComponentParam = {
            classList: CssClasses.createForm,
        };
        super(createFormParam);
        this.configComponent(
            service,
            garageSection,
            paginationSection,
            indexView
        );
    }

    private configComponent(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ): void {
        this.appendChildComponents(
            this.createChildrenComponents(
                service,
                garageSection,
                paginationSection,
                indexView
            )
        );
    }

    public createChildrenComponents(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ): (InputComponent | ButtonComponent)[] {
        return new CreateFormChildren(
            service,
            garageSection,
            paginationSection,
            indexView
        ).childArray;
    }
}
