import "./update-garage-view.css";
import { IBaseComponentParam } from "../../../../../../util/base-component";
import { View } from "../../../../view";
import { CreateFormView } from "./form-creare/form-create";
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
    public createFormView: CreateFormView;
    public random: CreateRandomView;
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
        this.createFormView = this.createCreateFormComponent(
            service,
            garageSection,
            paginationSection,
            indexView
        );
        this.random = this.createRandomComponent(
            service,
            garageSection,
            paginationSection,
            indexView
        );
        this.configView();
    }

    private configView() {
        this.viewComponent.appendChildComponents([
            this.random,
            this.createFormView,
            this.updateFormView,
        ]);
    }

    private createCreateFormComponent(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ): CreateFormView {
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

    private createRandomComponent(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ): CreateRandomView {
        return new CreateRandomView(
            service,
            garageSection,
            paginationSection,
            indexView
        );
    }
}
