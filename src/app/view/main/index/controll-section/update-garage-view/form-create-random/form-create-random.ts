import "./form-create-random.css";
import { IBaseComponentParam } from "../../../../../../../util/base-component";
import { FormComponent } from "../../../../../../../util/components/form-component";

import { CreateRandomComponent } from "./button-child/button-child";
import { Service } from "../../../../../../service/service";
import { GarageView } from "../../../garage-section/garage-view";
import { PaginationView } from "../../../pagination-section/pagination-view";
import { IndexView } from "../../../index-view";

const CssClasses: { createForm: string[] } = {
    createForm: ["update-garage_random"],
};

export class CreateRandomView extends FormComponent {
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
        this.appendChildComponents([
            this.createChildrenComponents(
                service,
                garageSection,
                paginationSection,
                indexView
            ),
        ]);
    }

    private createChildrenComponents(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ): CreateRandomComponent {
        return new CreateRandomComponent(
            service,
            garageSection,
            paginationSection,
            indexView
        );
    }
}
