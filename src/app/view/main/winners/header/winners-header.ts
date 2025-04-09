import "./winner-headers.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../util/base-component";
import { Service } from "../../../../service/service";
import { View } from "../../../view";
import { IPaginationDirection } from "../../index/pagination-section/pagination-view";

const CssClasses: { header: string[]; winsCount: string[]; page: string[] } = {
    header: ["winners_header"],
    winsCount: ["header_wins-count"],
    page: ["header_wins-page"],
};

export class WinnersHeaderView extends View {
    public pageNumber: number;
    private totalWinsCounComponent: BaseComponent;
    private pageNumberComponent: BaseComponent;
    public totalWinsNumber: number;
    constructor(service: Service) {
        const winnersHeaderParam: IBaseComponentParam = {
            tag: "header",
            classList: CssClasses.header,
        };
        super(winnersHeaderParam);
        this.pageNumber = 1;
        this.totalWinsNumber = 0;
        this.totalWinsCounComponent = new BaseComponent();
        this.pageNumberComponent = this.createPageNumberComponent();
        this.configView(service);
    }

    private async configView(service: Service) {
        this.totalWinsCounComponent =
            await this.createTotalCountComponent(service);

        this.viewComponent.appendChildComponents([
            this.totalWinsCounComponent,
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
        this.totalWinsNumber = parseInt(
            (await this.getTotalCount(service)) ?? ""
        );
        return this.createTextComponent(
            `Winners(${this.totalWinsNumber})`,
            CssClasses.winsCount
        );
    }

    private createPageNumberComponent() {
        return this.createTextComponent(
            `Page #${this.getPageNumber()}`,
            CssClasses.page
        );
    }

    private async getTotalCount(service: Service) {
        const winsNumberStr: string | null =
            await service.winnersService.getWinnersTotalCount();
        if (winsNumberStr) {
            this.totalWinsNumber = parseInt(winsNumberStr) + 1;
        }
        return winsNumberStr;
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
}
