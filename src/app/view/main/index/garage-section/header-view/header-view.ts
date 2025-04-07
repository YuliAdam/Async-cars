import "./header-view.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../../util/base-component";
import { Service } from "../../../../../service/service";
import { View } from "../../../../view";
import { IPaginationDirection } from "../../pagination-section/pagination-view";

const CssClasses: { header: string[]; page: string[]; garage: string[] } = {
    header: ["garage_header"],
    page: ["header_pageNumber"],
    garage: ["header_garage"],
};

export class GarageHeaderView extends View {
    public pageNumber: number;
    private totalCarCounComponent: BaseComponent;
    private pageNumberComponent: BaseComponent;
    public carsNumber: number;
    constructor(service: Service) {
        const garageHeaderParam: IBaseComponentParam = {
            tag: "header",
            classList: CssClasses.header,
        };
        super(garageHeaderParam);
        this.pageNumber = 1;
        this.carsNumber = 0;
        this.totalCarCounComponent = new BaseComponent();
        this.pageNumberComponent = this.createPageNumberComponent();
        this.configView(service);
    }
    private async configView(service: Service) {
        this.totalCarCounComponent =
            await this.createTotalCountComponent(service);

        this.viewComponent.appendChildComponents([
            this.totalCarCounComponent,
            this.pageNumberComponent,
        ]);
    }

    private createTextComponent(textContent: string, classes: string[]) {
        const textParam: IBaseComponentParam = {
            tag: "h2",
            classList: classes,
            textContent: textContent,
        };
        return new BaseComponent(textParam);
    }

    private async createTotalCountComponent(service: Service) {
        this.carsNumber = parseInt((await this.getTotalCount(service)) ?? "");
        return this.createTextComponent(
            `Garage(${this.carsNumber})`,
            CssClasses.garage
        );
    }

    private createPageNumberComponent() {
        return this.createTextComponent(
            `Page #${this.getPageNumber()}`,
            CssClasses.page
        );
    }

    private async getTotalCount(service: Service) {
        const carsNumberStr: string | null =
            await service.garageService.getGarageTotalCount();
        if (carsNumberStr) {
            this.carsNumber = parseInt(carsNumberStr) + 1;
        }
        return carsNumberStr;
    }

    public getPageNumber() {
        return this.pageNumber;
    }

    public getNextPageNumberElement(direction: IPaginationDirection) {
        this.pageNumber += direction;
        const text: string = `Page #${this.getPageNumber()}`;
        const newHeaderComponent: BaseComponent = this.createTextComponent(
            text,
            CssClasses.page
        );
        const newHeader: HTMLElement | null = newHeaderComponent.getElement();
        if (newHeader) {
            const parentEl: HTMLElement | null =
                this.pageNumberComponent.getParentComponent();
            if (parentEl) {
                parentEl.replaceChild(newHeader, parentEl.children[1]);
                this.pageNumberComponent = newHeaderComponent;
            }
        }
    }

    public changeCountCarNumber(numCars: number) {
        this.carsNumber = numCars;
        const text: string = `Garage(${numCars})`;
        const newHeader: BaseComponent = this.createTextComponent(
            text,
            CssClasses.garage
        );
        const newHeaderElement: HTMLElement | null = newHeader.getElement();
        if (newHeaderElement) {
            const parentEl: HTMLElement | null =
                this.totalCarCounComponent.getParentComponent();
            if (parentEl) {
                parentEl.replaceChild(newHeaderElement, parentEl.children[0]);
                this.totalCarCounComponent = newHeader;
            }
        }
    }
}
