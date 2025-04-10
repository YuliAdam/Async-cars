import "./wins-table.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../util/base-component";
import { Service } from "../../../../service/service";
import { View } from "../../../view";
import { WinnersHeaderView } from "../header/winners-header";
import {
    IOrderOption,
    IResponseWinnerParams,
    ISortOption,
    IWinnersParams,
} from "../../../../service/winners-service/winners-service";
import { ICarParam } from "../../../../service/garage-service/garage-service";
import { Car } from "../../index/garage-section/roads-view/car-panel-view/car-move-view/car-move-children/car";
import {
    IImgParam,
    ImgComponent,
} from "../../../../../util/components/img-component";

const CssClasses: { table: string[]; sort: string[]; car: string } = {
    table: ["winners_table"],
    sort: ["table_sort"],
    car: "table_car",
};

const HEADERS: string[] = ["Number", "Car", "Name", "Wins", "Best time (sec)"];
const WINS_LIMIT: number = 10;

export class WinnersTableView extends View {
    public tableBody: BaseComponent;
    private pageNumber: number;
    private order: IOrderOption;
    private sortParam: ISortOption;
    constructor(service: Service, headerComponent: WinnersHeaderView) {
        const tableParams: IBaseComponentParam = {
            tag: "table",
            classList: CssClasses.table,
        };
        super(tableParams);
        this.tableBody = new BaseComponent();
        this.pageNumber = 0;
        this.order = IOrderOption.ASC;
        this.sortParam = ISortOption.id;
        this.configView(service, headerComponent);
    }

    public async configView(
        service: Service,
        headerComponent: WinnersHeaderView
    ) {
        this.pageNumber = headerComponent.pageNumber;
        const getWinnerParams: IWinnersParams = {
            _page: this.pageNumber,
            _limit: WINS_LIMIT,
            _order: this.order,
            _sort: this.sortParam,
        };
        this.tableBody = await this.createTableBody(service, getWinnerParams);
        this.viewComponent.appendChildComponents([
            this.createTableHeader(service),
            this.tableBody,
        ]);
    }

    private createTableHeader(service: Service): BaseComponent {
        const thead: BaseComponent = new BaseComponent({ tag: "thead" });
        const tr: BaseComponent = new BaseComponent({ tag: "tr" });
        const SORTING_COLUMN_INDEX: number[] = [3, 4];
        const SORTING_PARAMS: ISortOption[] = [
            ISortOption.wins,
            ISortOption.time,
        ];
        HEADERS.forEach((el, i) => {
            const cell: BaseComponent = new BaseComponent({
                tag: "th",
                textContent: el,
            });
            if (SORTING_COLUMN_INDEX.includes(i)) {
                cell.appendChildComponents([
                    this.createSortImage(
                        SORTING_PARAMS[SORTING_COLUMN_INDEX.indexOf(i)],
                        service
                    ),
                ]);
            }
            tr.appendChildComponents([cell]);
        });
        thead.appendChildComponents([tr]);
        return thead;
    }

    private createSortImage(sortParam: ISortOption, service: Service) {
        const sortImgBaseParam: IBaseComponentParam = {
            tag: "img",
            classList: CssClasses.sort,
        };
        const imgParam: IImgParam = {
            src: "sort.svg",
            alt: "sort img",
        };
        const imgComponent: ImgComponent = new ImgComponent(
            sortImgBaseParam,
            imgParam
        );
        imgComponent.addComponentEventListener("click", () =>
            this.sortingEvent(sortParam, service)
        );
        return imgComponent;
    }

    private async sortingEvent(sortParam: ISortOption, service: Service) {
        if (this.order === IOrderOption.ASC) {
            this.order = IOrderOption.DESC;
        } else {
            this.order = IOrderOption.ASC;
        }
        this.sortParam = sortParam;
        const getSortingParams: IWinnersParams = {
            _page: this.pageNumber,
            _limit: WINS_LIMIT,
            _order: this.order,
            _sort: this.sortParam,
        };
        await this.replaceBody(service, getSortingParams);
    }

    private async createTableBody(
        service: Service,
        getWinnersParams: IWinnersParams
    ): Promise<BaseComponent> {
        const winnersParam: IResponseWinnerParams[] = await this.getWinners(
            service,
            getWinnersParams
        );
        const count = winnersParam.length;
        const tbody: BaseComponent = new BaseComponent({ tag: "tbody" });
        for (let i = 0; i < count; i++) {
            const tr: BaseComponent = new BaseComponent({ tag: "tr" });
            tr.appendChildComponents(
                await this.getRowWithData(
                    service,
                    winnersParam[i],
                    (this.pageNumber - 1) * 10 + i + 1
                )
            );
            tbody.appendChildComponents([tr]);
        }
        return tbody;
    }

    private async replaceBody(
        service: Service,
        getWinnersParams: IWinnersParams
    ) {
        console.log(getWinnersParams);
        const newBody = (
            await this.createTableBody(service, getWinnersParams)
        ).getElement();
        const tableElement: HTMLElement | null =
            this.viewComponent.getElement();
        if (tableElement && newBody) {
            tableElement.replaceChild(newBody, tableElement.children[1]);
        }
    }

    private async getWinners(
        service: Service,
        getWinnersParams: IWinnersParams
    ): Promise<IResponseWinnerParams[]> {
        return await service.winnersService.getWinners(getWinnersParams);
    }

    private async getRowWithData(
        service: Service,
        winsParams: IResponseWinnerParams,
        rowNum: number
    ): Promise<BaseComponent[]> {
        const carParams: ICarParam = await this.getCarParams(
            service,
            winsParams.id
        );
        const td1: BaseComponent = new BaseComponent({
            tag: "td",
            textContent: `${rowNum}`,
        });
        const td2: BaseComponent = new BaseComponent({
            tag: "td",
        });
        const car: Car = new Car(carParams);
        td2.appendChildComponents([car]);
        this.setCarClass(car);
        const td3: BaseComponent = new BaseComponent({
            tag: "td",
            textContent: `${carParams.name}`,
        });
        const td4: BaseComponent = new BaseComponent({
            tag: "td",
            textContent: `${winsParams.wins}`,
        });
        const td5: BaseComponent = new BaseComponent({
            tag: "td",
            textContent: `${winsParams.time}`,
        });
        return [td1, td2, td3, td4, td5];
    }

    private async getCarParams(service: Service, id: number) {
        return await service.garageService.getCar(id);
    }

    private setCarClass(car: Car) {
        const carEl: HTMLElement | null = car.getElement();
        if (carEl) {
            carEl.classList.remove("controller_car");
            carEl.classList.add(CssClasses.car);
        }
    }
}
