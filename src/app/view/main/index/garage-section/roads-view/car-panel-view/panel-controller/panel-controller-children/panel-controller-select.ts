import { IBaseComponentParam } from "../../../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../../../util/components/button-component";
import { ICarParam } from "../../../../../../../../service/garage-service/garage-service";
import { IndexView } from "../../../../../index-view";
import { CarPanelView } from "../../car-panel-view";

const CssClasses: { remove: string[] } = {
    remove: ["controller_select"],
};

const SELECT_BUTTON_TEXT = "Select";

export class RoadSelectComponent extends ButtonComponent {
    constructor(indexView: IndexView, carParams: ICarParam, carPanelView: CarPanelView) {
        const roadSelectParam: IBaseComponentParam = {
            classList: CssClasses.remove,
            textContent: SELECT_BUTTON_TEXT,
        };
        super(roadSelectParam);
        this.addSelectEvent(indexView, carParams, carPanelView);
    }

    private addSelectEvent(indexView: IndexView, carParams: ICarParam, carPanelView: CarPanelView) {
        this.addComponentEventListener("click", () => {
            indexView.controllSection.updateGarageView.updateFormView.replaceUpdateFormElements(
                carParams, carPanelView
            );

        });
    }

}
