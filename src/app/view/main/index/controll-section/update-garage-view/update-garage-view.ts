import "./update-garage-view.css";
import { IBaseComponentParam } from "../../../../../../util/base-component";
import { View } from "../../../../view";
import { CreateFormView } from "./form-creare/form-create";
import { FormComponent } from "../../../../../../util/components/form-component";
import { UpdateFormView } from "./form-update/form-update";
import { CreateRandomView } from "./form-create-random/form-create-random";
import { Service } from "../../../../../service/service";
import { GarageView } from "../../garage-section/garage-view";
import { PaginationView } from "../../pagination-section/pagination-view";
import { IndexView } from "../../index-view";

const CssClasses: { updateWrap: string[] } = {
    updateWrap: ["controll_update_wrapper"],
};

export class UpdateGarageView extends View {
    public updateFormView: UpdateFormView;
    constructor(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ) {
        const updateGarageParam: IBaseComponentParam = {
            classList: CssClasses.updateWrap,
        };
        super(updateGarageParam);
        this.updateFormView = this.createUpdateFormComponent(service);
        this.configView(service, garageSection, paginationSection, indexView);
    }

    private configView(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ) {
        this.viewComponent.appendChildComponents([
            this.createRandomComponent(),
            this.createCreateFormComponent(
                service,
                garageSection,
                paginationSection,
                indexView
            ),
            this.updateFormView,
        ]);
    }

    private createCreateFormComponent(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ): FormComponent {
        return new CreateFormView(
            service,
            garageSection,
            paginationSection,
            indexView
        );
    }

    private createUpdateFormComponent(service: Service): UpdateFormView {
        return new UpdateFormView(service);
    }

    private createRandomComponent(): FormComponent {
        return new CreateRandomView();
    }
}
