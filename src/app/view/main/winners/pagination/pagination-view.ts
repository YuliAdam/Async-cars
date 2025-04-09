import "./pagination-view.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../util/base-component";
import { ButtonComponent } from "../../../../../util/components/button-component";
import { Service } from "../../../../service/service";
import { View } from "../../../view";
import { WinnersView } from "../winners-view";

const CssClasses: {
    pagination: string[];
    prev: string[];
    next: string[];
    over: string[];
    relativDiv: string[];
} = {
    pagination: ["winners_pagination"],
    prev: ["pagination_prev"],
    next: ["pagination_next"],
    over: ["over"],
    relativDiv: ["relativ-div"],
};

export enum IPaginationDirection {
    next = 1,
    prev = -1,
}

const PREV_BUTTON_TEXT: string = "Prev";
const NEXT_BUTTON_TEXT: string = "Next";
const WINNERS_LIMIT: number = 10;

export class PaginationView extends View {
    private prevButton: ButtonComponent;
    public nextButton: ButtonComponent;
    constructor(service: Service, winnersView: WinnersView) {
        const paginationParam: IBaseComponentParam = {
            classList: CssClasses.pagination,
        };
        super(paginationParam);
        this.prevButton = this.createPrevButtonComponent(service, winnersView);
        this.nextButton = this.createNextButtonComponent(service, winnersView);
        this.configView(service);
    }
    private async configView(service: Service) {
        const divPrev = new BaseComponent({ classList: CssClasses.relativDiv });
        const divNext = new BaseComponent({ classList: CssClasses.relativDiv });
        const activOverComponent: BaseComponent = new BaseComponent({
            classList: CssClasses.over,
        });
        const InActivOverComponent: BaseComponent = new BaseComponent({
            classList: [...CssClasses.over, "display-none"],
        });

        const FIRST_PAGE_NUMBER = 1;
        if (await this.hasNextPage(service, FIRST_PAGE_NUMBER)) {
            divNext.appendChildComponents([
                this.nextButton,
                InActivOverComponent,
            ]);
        } else {
            const activOverComponent: BaseComponent = new BaseComponent({
                classList: CssClasses.over,
            });
            divNext.appendChildComponents([
                this.nextButton,
                activOverComponent,
            ]);
        }
        divPrev.appendChildComponents([this.prevButton, activOverComponent]);

        this.viewComponent.appendChildComponents([divPrev, divNext]);
    }

    private createPrevButtonComponent(
        service: Service,
        winnersView: WinnersView
    ): ButtonComponent {
        const prevButtonParam: IBaseComponentParam = {
            classList: CssClasses.prev,
            textContent: PREV_BUTTON_TEXT,
        };
        const prevButton = new ButtonComponent(prevButtonParam);
        prevButton.addComponentEventListener("click", () =>
            this.addPrevPageButtonEvent(service, winnersView)
        );
        return prevButton;
    }
    private createNextButtonComponent(
        service: Service,
        winnersView: WinnersView
    ): ButtonComponent {
        const nextButtonParam: IBaseComponentParam = {
            classList: CssClasses.next,
            textContent: NEXT_BUTTON_TEXT,
        };
        const nextButton = new ButtonComponent(nextButtonParam);
        nextButton.addComponentEventListener("click", () =>
            this.addNextPageButtonEvent(service, winnersView)
        );
        return nextButton;
    }

    private async addNextPageButtonEvent(
        service: Service,
        winnersView: WinnersView
    ) {
        if (
            !(await this.hasNextPage(
                service,
                winnersView.headerComponent.pageNumber + 1
            ))
        ) {
            const over = this.nextButton.getNextSiblingElement();
            if (over) {
                over.classList.remove("display-none");
            }
        }
        if (
            await this.hasNextPage(
                service,
                winnersView.headerComponent.pageNumber
            )
        ) {
            const over = this.prevButton.getNextSiblingElement();
            if (over && !over.classList.contains("display-none")) {
                over.classList.add("display-none");
            }
            this.changePageNumber(winnersView, IPaginationDirection.next);
            await this.replaceWinnersTable(service, winnersView);
        }
    }

    private async addPrevPageButtonEvent(
        service: Service,
        winnersView: WinnersView
    ) {
        if (winnersView.headerComponent.pageNumber === 2) {
            const over = this.prevButton.getNextSiblingElement();
            if (over) {
                over.classList.remove("display-none");
            }
        }
        if (winnersView.headerComponent.pageNumber > 1) {
            const over = this.nextButton.getNextSiblingElement();
            if (over && !over.classList.contains("display-none")) {
                over.classList.add("display-none");
            }
            this.changePageNumber(winnersView, IPaginationDirection.prev);
            await this.replaceWinnersTable(service, winnersView);
        }
    }

    private changePageNumber(
        winnersView: WinnersView,
        direction: IPaginationDirection
    ): number {
        winnersView.headerComponent.getNextPageNumberElement(direction);
        return winnersView.headerComponent.getPageNumber();
    }

    private async replaceWinnersTable(
        service: Service,
        winnersView: WinnersView
    ) {
        winnersView.tableComponent.viewComponent.removeChildren();
        await winnersView.tableComponent.configView(
            service,
            winnersView.headerComponent
        );
    }

    private async hasNextPage(
        service: Service,
        page: number
    ): Promise<boolean> {
        service.winnersService.winnersCount = parseInt(
            (await service.winnersService.getWinnersTotalCount()) ?? ""
        );
        return page * WINNERS_LIMIT < service.garageService.carsNumber;
    }
}
