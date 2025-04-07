import "./form-update.css";
import { IBaseComponentParam } from "../../../../../../../util/base-component";
import { FormComponent } from "../../../../../../../util/components/form-component";
import { InputComponent } from "../../../../../../../util/components/input-component";
import { UpdateFormChildren } from "./form-update-children/form-update-children";
import { Service } from "../../../../../../service/service";
import { ICarParam } from "../../../../../../service/garage-service/garage-service";
import { GarageView } from "../../../garage-section/garage-view";
import { CarPanelView } from "../../../garage-section/roads-view/car-panel-view/car-panel-view";

const CssClasses: { updateForm: string[] } = {
    updateForm: ["update-garage_update"],
};

export class UpdateFormView extends FormComponent {
    public updateFormChildren: UpdateFormChildren;
    constructor(service: Service) {
        const updateFormParam: IBaseComponentParam = {
            classList: CssClasses.updateForm,
        };
        super(updateFormParam);
        this.updateFormChildren = this.createChildrenComponents(service);
        this.configComponent();
    }

    private configComponent(): void {
        this.appendChildComponents(this.updateFormChildren.childArray);
    }

    private createChildrenComponents(service: Service): UpdateFormChildren {
        return new UpdateFormChildren(service);
    }

    public replaceUpdateFormElements(
        carParams: ICarParam,
        carPanelView: CarPanelView
    ) {
        const newNameInput: InputComponent =
            this.updateFormChildren.createInputComponent();
        newNameInput.setValue(carParams.name);
        const newColorInput: InputComponent =
            this.updateFormChildren.createColorComponent();
        newColorInput.setValue(carParams.color);
        const newNameInputElement: HTMLElement | null =
            newNameInput.getElement();
        const newColorInputElement: HTMLElement | null =
            newColorInput.getElement();
        this.updateFormChildren.colorInputComponent = newColorInput;
        this.updateFormChildren.nameInputComponent = newNameInput;
        this.updateFormChildren.carParams = carParams;
        this.updateFormChildren.newCarParams = carParams;
        this.updateFormChildren.carPanelView = carPanelView;
        const updateFormElement: HTMLElement | null = this.getElement();
        if (
            updateFormElement &&
            newNameInputElement &&
            newColorInputElement &&
            newNameInputElement instanceof HTMLInputElement
        ) {
            updateFormElement.replaceChild(
                newNameInputElement,
                updateFormElement.children[0]
            );
            updateFormElement.replaceChild(
                newColorInputElement,
                updateFormElement.children[1]
            );
        }
    }
}
