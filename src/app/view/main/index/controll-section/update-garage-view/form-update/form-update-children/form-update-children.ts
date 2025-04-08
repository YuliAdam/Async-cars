import "./form-update-children.css";
import { IBaseComponentParam } from "../../../../../../../../util/base-component";
import { ComponentChildren } from "../../../../../../../../util/child-component-array";
import { ButtonComponent } from "../../../../../../../../util/components/button-component";
import {
    IInputParam,
    InputComponent,
} from "../../../../../../../../util/components/input-component";
import { Service } from "../../../../../../../service/service";
import { ICarParam } from "../../../../../../../service/garage-service/garage-service";
import { CarPanelView } from "../../../../garage-section/roads-view/car-panel-view/car-panel-view";

const CssClasses: { input: string[]; color: string[]; button: string[] } = {
    input: ["update_name"],
    color: ["update_color"],
    button: ["update_button"],
};

const CREATE_BUTTON_TEXT: string = "Update";
const COLOR_INIT: string = "#00ff1a";

export class UpdateFormChildren extends ComponentChildren<
    ButtonComponent | InputComponent
> {
    public nameInputComponent: InputComponent;
    public colorInputComponent: InputComponent;
    public carParams: ICarParam | null;
    public newCarParams: ICarParam;
    public updateButtonComponent: ButtonComponent;
    public carPanelView: CarPanelView | null;
    constructor(service: Service) {
        super();
        this.nameInputComponent = this.createInputComponent();
        this.colorInputComponent = this.createColorComponent();
        this.carParams = null;
        this.updateButtonComponent = this.createButtonComponent(service);
        this.childArray.push(this.updateButtonComponent);
        this.carPanelView = null;
        this.newCarParams = { id: 0, name: "", color: "" };
    }

    protected getComponentArr(): InputComponent[] {
        this.colorInputComponent = this.createColorComponent();
        this.colorInputComponent.setValue(COLOR_INIT);
        return [this.createInputComponent(), this.colorInputComponent];
    }

    public createInputComponent(): InputComponent {
        const inputParam: IBaseComponentParam = {
            classList: CssClasses.input,
        };
        const inputAdditionalParam: IInputParam = {
            type: "text",
        };
        const createCarNameInputComponent = new InputComponent(
            inputParam,
            inputAdditionalParam
        );
        createCarNameInputComponent.addComponentEventListener("change", () =>
            this.addChangeNameEvent()
        );
        return createCarNameInputComponent;
    }
    public createColorComponent() {
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
        color.addComponentEventListener("change", () =>
            this.addChangeColorEvent()
        );
        return color;
    }
    private createButtonComponent(service: Service): ButtonComponent {
        const buttonParam: IBaseComponentParam = {
            classList: CssClasses.button,
            textContent: CREATE_BUTTON_TEXT,
        };
        const buttonComponent: ButtonComponent = new ButtonComponent(
            buttonParam
        );
        buttonComponent.addComponentEventListener("click", () => {
            this.addUpdateButtonEvent(service);
        });
        return buttonComponent;
    }

    private async addUpdateButtonEvent(service: Service): Promise<void> {
        if (this.carParams && this.carPanelView) {
            this.newCarParams.id = this.carParams.id;
            this.updateCarPanelView(this.newCarParams, this.carPanelView);
            await service.garageService.updateCar(this.newCarParams);
        }
        this.carParams = null;
        this.carPanelView = null;
    }

    private updateCarPanelView(
        carParams: ICarParam,
        carPanelView: CarPanelView
    ) {
        carPanelView.controllerComponent.setCarName(carParams.name);
        carPanelView.moveComponent.setCarColor(carParams);
    }

    private addChangeNameEvent() {
        const nameElement: HTMLElement | null =
            this.nameInputComponent.getElement();
        if (nameElement && nameElement instanceof HTMLInputElement) {
            this.newCarParams.name = nameElement.value;
        }
    }
    private addChangeColorEvent() {
        const colorElement: HTMLElement | null =
            this.colorInputComponent.getElement();
        if (colorElement && colorElement instanceof HTMLInputElement) {
            this.newCarParams.color = colorElement.value;
        }
    }
}
