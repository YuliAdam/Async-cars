import "./pagination-view.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../util/base-component";
import { ButtonComponent } from "../../../../../util/components/button-component";
import { Service } from "../../../../service/service";
import { View } from "../../../view";
import { GarageView } from "../garage-section/garage-view";
import { CARS_LIMIT } from "../garage-section/roads-view/roads-view";
import { IndexView } from "../index-view";

const CssClasses: {
    pagination: string[];
    prev: string[];
    next: string[];
    over: string[];
    relativDiv: string[];
} = {
    pagination: ["garage_pagination"],
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

export class PaginationView extends View {
    private prevButton: ButtonComponent;
    public nextButton: ButtonComponent;
    constructor(
        service: Service,
        garageSection: GarageView,
        indexView: IndexView
    ) {
        const paginationParam: IBaseComponentParam = {
            classList: CssClasses.pagination,
        };
        super(paginationParam);
        this.prevButton = this.createPrevButtonComponent(
            service,
            garageSection,
            indexView
        );
        this.nextButton = this.createNextButtonComponent(
            service,
            garageSection,
            indexView
        );
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
        console.log( await this.hasNextPage(service, FIRST_PAGE_NUMBER));
        if ( await this.hasNextPage(service, FIRST_PAGE_NUMBER)) {
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
        garageSection: GarageView,
        indexView: IndexView
    ): ButtonComponent {
        const prevButtonParam: IBaseComponentParam = {
            classList: CssClasses.prev,
            textContent: PREV_BUTTON_TEXT,
        };
        const prevButton = new ButtonComponent(prevButtonParam);
        prevButton.addComponentEventListener("click", () =>
            this.addPrevPageButtonEvent(service, garageSection, indexView)
        );
        return prevButton;
    }
    private createNextButtonComponent(
        service: Service,
        garageSection: GarageView,
        indexView: IndexView
    ): ButtonComponent {
        const nextButtonParam: IBaseComponentParam = {
            classList: CssClasses.next,
            textContent: NEXT_BUTTON_TEXT,
        };
        const nextButton = new ButtonComponent(nextButtonParam);
        nextButton.addComponentEventListener("click", () =>
            this.addNextPageButtonEvent(service, garageSection, indexView)
        );
        return nextButton;
    }

    private async addNextPageButtonEvent(
        service: Service,
        garageSection: GarageView,
        indexView: IndexView
    ) {
        if (
            !(await this.hasNextPage(
                service,
                garageSection.garageHeader.pageNumber + 1
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
                garageSection.garageHeader.pageNumber
            )
        ) {
            const over = this.prevButton.getNextSiblingElement();
            if (over && !over.classList.contains("display-none")) {
                over.classList.add("display-none");
            }
            const newPageNumber = this.changePageNumber(
                garageSection,
                IPaginationDirection.next
            );
            await this.replaceCarsPanels(
                service,
                garageSection,
                newPageNumber,
                indexView
            );
        }
    }

    private async addPrevPageButtonEvent(
        service: Service,
        garageSection: GarageView,
        indexView: IndexView
    ) {
        if (garageSection.garageHeader.pageNumber === 2) {
            const over = this.prevButton.getNextSiblingElement();
            if (over) {
                over.classList.remove("display-none");
            }
        }
        if (garageSection.garageHeader.pageNumber > 1) {
            const over = this.nextButton.getNextSiblingElement();
            if (over && !over.classList.contains("display-none")) {
                over.classList.add("display-none");
            }
            const newPageNumber = this.changePageNumber(
                garageSection,
                IPaginationDirection.prev
            );
            await this.replaceCarsPanels(
                service,
                garageSection,
                newPageNumber,
                indexView
            );
        }
    }

    private changePageNumber(
        garageSection: GarageView,
        direction: IPaginationDirection
    ): number {
        garageSection.garageHeader.getNextPageNumberElement(direction);
        return garageSection.garageHeader.getPageNumber();
    }

    private async replaceCarsPanels(
        service: Service,
        garageSection: GarageView,
        newPageNumber: number,
        indexView: IndexView
    ) {
        garageSection.garageRoad.viewComponent.removeChildren();
        const newChild: BaseComponent[] =
            await garageSection.garageRoad.createCarsPanels(
                service,
                newPageNumber,
                indexView
            );
        garageSection.garageRoad.viewComponent.appendChildComponents(newChild);
    }

    private async hasNextPage(
        service: Service,
        page: number
    ): Promise<boolean> {
        service.garageService.carsNumber = parseInt(
            (await service.garageService.getGarageTotalCount()) ?? ""
        );
        return page * CARS_LIMIT < service.garageService.carsNumber;
    }
}
