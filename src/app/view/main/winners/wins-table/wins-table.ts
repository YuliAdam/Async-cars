import "./wins-table.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../util/base-component";
import { Service } from "../../../../service/service";
import { View } from "../../../view";
import { WinnersHeaderView } from "../header/winners-header";
import { IResponseWinnerParams } from "../../../../service/winners-service/winners-service";
import { ICarParam } from "../../../../service/garage-service/garage-service";
import { Car } from "../../index/garage-section/roads-view/car-panel-view/car-move-view/car-move-children/car";

const CssClasses: { table: string[]; car: string } = {
    table: ["winners_table"],
    car: "table_car",
};

const HEADERS: string[] = ["Number", "Car", "Name", "Wins", "Best time (sec)"];
const WINS_LIMIT: number = 10;

export class WinnersTableView extends View {
    public tableBody: BaseComponent;
    constructor(service: Service, headerComponent: WinnersHeaderView) {
        const tableParams: IBaseComponentParam = {
            tag: "table",
            classList: CssClasses.table,
        };
        super(tableParams);
        this.tableBody = new BaseComponent();
        this.configView(service, headerComponent);
    }

    public async configView(
        service: Service,
        headerComponent: WinnersHeaderView
    ) {
        this.tableBody = await this.createTableBody(service, headerComponent);
        this.viewComponent.appendChildComponents([
            this.createTableHeader(),
            this.tableBody,
        ]);
    }

    private createTableHeader(): BaseComponent {
        const thead: BaseComponent = new BaseComponent({ tag: "thead" });
        const tr: BaseComponent = new BaseComponent({ tag: "tr" });
        HEADERS.forEach((el) =>
            tr.appendChildComponents([
                new BaseComponent({ tag: "th", textContent: el }),
            ])
        );
        thead.appendChildComponents([tr]);
        return thead;
    }

    private async createTableBody(
        service: Service,
        headerComponent: WinnersHeaderView
    ): Promise<BaseComponent> {
        const winnersParam: IResponseWinnerParams[] = await this.getWinners(
            service,
            headerComponent
        );
        const count = winnersParam.length;
        const tbody: BaseComponent = new BaseComponent({ tag: "tbody" });
        for (let i = 0; i < count; i++) {
            const tr: BaseComponent = new BaseComponent({ tag: "tr" });
            tr.appendChildComponents(
                await this.getRowWithData(service, winnersParam[i], i + 1)
            );
            tbody.appendChildComponents([tr]);
        }
        return tbody;
    }

    private async getWinners(
        service: Service,
        headerComponent: WinnersHeaderView
    ): Promise<IResponseWinnerParams[]> {
        const page = headerComponent.pageNumber;
        console.log(page);
        return await service.winnersService.getWinners({
            _page: page,
            _limit: WINS_LIMIT,
        });
    }

    private async getRowWithData(
        service: Service,
        winsParams: IResponseWinnerParams,
        rowNum: number
    ): Promise<BaseComponent[]> {
        console.log(winsParams);
        const carParams: ICarParam = await this.getCarParams(
            service,
            winsParams.id
        );

        console.log(carParams);
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
