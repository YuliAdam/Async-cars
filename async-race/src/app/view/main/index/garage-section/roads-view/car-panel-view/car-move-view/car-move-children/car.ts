import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../../../../../util/base-component";
import { svg } from "./car-path-arr";

const CssClasses: { car: string[] } = {
    car: ["controller_car"],
};

export class Car extends BaseComponent {
    private svg: Element | null;
    constructor(color: string) {
        const carParam: IBaseComponentParam = {
            classList: CssClasses.car,
        };
        super(carParam);
        this.svg = this.createCarSvg();
        this.setColor(color);
    }

    public createCarSvg(): Element | null {
        const div = this.getElement();
        let svgElement: Element | null = null;
        if (div) {
            div.innerHTML = svg;
            svgElement = div.firstElementChild;
        }
        return svgElement;
    }

    public setColor(color: string): void {
        if (this.svg) this.svg.setAttribute("fill", color);
    }
}
