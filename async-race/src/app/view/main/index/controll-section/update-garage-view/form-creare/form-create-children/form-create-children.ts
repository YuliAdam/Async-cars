import "./form-create-children.css";
import { type IBaseComponentParam } from "../../../../../../../../util/base-component";
import { ComponentChildren } from "../../../../../../../../util/child-component-array";
import { ButtonComponent } from "../../../../../../../../util/components/button-component";
import {
    IInputParam,
    InputComponent,
} from "../../../../../../../../util/components/input-component";
import { Service } from "../../../../../../../service/service";
import {
    ICarParam,
    ICreateCarParams,
} from "../../../../../../../service/garage-service/garage-service";
import { GarageView } from "../../../../garage-section/garage-view";
import { PaginationView } from "../../../../pagination-section/pagination-view";
import { CARS_LIMIT } from "../../../../garage-section/roads-view/roads-view";
import { IndexView } from "../../../../index-view";

const CssClasses: { input: string[]; color: string[]; button: string[] } = {
    input: ["create_name"],
    color: ["create_color"],
    button: ["create_button"],
};

const CREATE_BUTTON_TEXT: string = "Create";

export class CreateFormChildren extends ComponentChildren<
    ButtonComponent | InputComponent
> {
    private createButton;
    private nameInput;
    private colorInput;
    constructor(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ) {
        super();
        this.nameInput = this.childArray[0];
        this.colorInput = this.childArray[1];
        this.createButton = this.createButtonComponent(
            service,
            garageSection,
            paginationSection,
            indexView
        );
        this.childArray.push(this.createButton);
    }

    protected getComponentArr(): (ButtonComponent | InputComponent)[] {
        return [this.createInputComponent(), this.createColorComponent()];
    }

    private createInputComponent(): InputComponent {
        const inputParam: IBaseComponentParam = {
            classList: CssClasses.input,
        };
        const inputAdditionalParam: IInputParam = {
            type: "text",
        };
        return new InputComponent(inputParam, inputAdditionalParam);
    }

    private createColorComponent() {
        const colorParam: IBaseComponentParam = {
            classList: CssClasses.color,
        };
        const inputAdditionalParam: IInputParam = {
            type: "color",
        };
        const color: InputComponent = new InputComponent(
            colorParam,
            inputAdditionalParam
        );
        color.setValue("#00ff1a");
        return color;
    }

    private createButtonComponent(
        service: Service,
        gargeSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ) {
        const buttonParam: IBaseComponentParam = {
            classList: CssClasses.button,
            textContent: CREATE_BUTTON_TEXT,
        };
        const createButton: ButtonComponent = new ButtonComponent(buttonParam);
        createButton.addComponentEventListener("click", () =>
            this.addCreateCarEvent(
                service,
                gargeSection,
                paginationSection,
                indexView
            )
        );
        return createButton;
    }

    private getNameValue(): string {
        const inputNameComponet: HTMLElement | null =
            this.nameInput.getElement();
        if (inputNameComponet instanceof HTMLInputElement) {
            return inputNameComponet.value;
        }
        return "";
    }
    private getColorValue(): string {
        const inputColorComponet: HTMLElement | null =
            this.colorInput.getElement();
        if (inputColorComponet instanceof HTMLInputElement) {
            return inputColorComponet.value;
        }
        return "";
    }

    private async addCreateCarEvent(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ) {
        const body: ICreateCarParams = {
            name: this.getNameValue(),
            color: this.getColorValue(),
        };
        const newCarParams: ICarParam =
            await service.garageService.createCar(body);
        if (newCarParams.id > CARS_LIMIT) {
            this.activateNextButton(paginationSection);
        }
        this.addCarViewPanel(garageSection, service, newCarParams, indexView);
        this.changeHederCarNumber(garageSection);
    }

    private addCarViewPanel(
        garageSection: GarageView,
        service: Service,
        params: ICarParam,
        indexView: IndexView
    ) {
        garageSection.garageRoad.addNewCarPanelView(service, params, indexView);
    }

    private changeHederCarNumber(garageSection: GarageView) {
        garageSection.garageHeader.changeCountCarNumber(
            garageSection.garageHeader.carsNumber + 1
        );
    }

    private activateNextButton(paginationSection: PaginationView) {
        const overDiv: Element | null =
            paginationSection.nextButton.getNextSiblingElement();
        if (overDiv && !overDiv.classList.contains("display-none")) {
            overDiv.classList.add("display-none");
        }
    }
}
