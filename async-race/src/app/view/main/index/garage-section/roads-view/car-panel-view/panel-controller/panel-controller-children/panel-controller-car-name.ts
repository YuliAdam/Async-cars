import "./panel-controller-children.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../../../../../util/base-component";

const CssClasses: { carName: string[] } = {
    carName: ["controller_car-name"],
};

export class RoadCarNameComponent extends BaseComponent {
    constructor(carName: string) {
        const roadCarNameParam: IBaseComponentParam = {
            tag: "h3",
            classList: CssClasses.carName,
            textContent: carName,
        };
        super(roadCarNameParam);
    }
}
