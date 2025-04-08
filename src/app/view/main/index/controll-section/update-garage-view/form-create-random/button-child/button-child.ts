import "./button-child.css";
import { IBaseComponentParam } from "../../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../../util/components/button-component";
import { Service } from "../../../../../../../service/service";
import { GarageView } from "../../../../garage-section/garage-view";
import { PaginationView } from "../../../../pagination-section/pagination-view";
import { IndexView } from "../../../../index-view";
import { getRandomCarsArr } from "../../form-creare/form-create-children/car-random-params";
import {
    ICarParam,
    ICreateCarParams,
} from "../../../../../../../service/garage-service/garage-service";
import { CARS_LIMIT } from "../../../../garage-section/roads-view/roads-view";

const CssClasses: { createRandom: string[] } = {
    createRandom: ["create_random"],
};

const CREATE_RANDOM_TEXT: string = "Generate cars";

export class CreateRandomComponent extends ButtonComponent {
    constructor(
        service: Service,
        garageSection: GarageView,
        paginationSection: PaginationView,
        indexView: IndexView
    ) {
        const createRandomParam: IBaseComponentParam = {
            classList: CssClasses.createRandom,
            textContent: CREATE_RANDOM_TEXT,
        };
        super(createRandomParam);
        this.addComponentEventListener("click", () =>
            this.addCreateRandomCarEvent(
                service,
                paginationSection,
                garageSection,
                indexView
            )
        );
    }

    private async addCreateRandomCarEvent(
        service: Service,
        paginationSection: PaginationView,
        garageSection: GarageView,
        indexView: IndexView
    ) {
        const carArr = getRandomCarsArr();
        carArr.forEach(async (el) => {
            const body: ICreateCarParams = {
                name: el.name,
                color: el.color,
            };
            const newCarParams: ICarParam =
                await service.garageService.createCar(body);
            if (newCarParams.id > CARS_LIMIT) {
                this.activateNextButton(paginationSection);
            }
            this.addCarViewPanel(
                garageSection,
                service,
                newCarParams,
                indexView
            );
            this.changeHederCarNumber(garageSection);
        });
    }
    private activateNextButton(paginationSection: PaginationView) {
        const overDiv: Element | null =
            paginationSection.nextButton.getNextSiblingElement();
        if (overDiv && !overDiv.classList.contains("display-none")) {
            overDiv.classList.add("display-none");
        }
    }

    private addCarViewPanel(
        garageSection: GarageView,
        service: Service,
        params: ICarParam,
        indexView: IndexView
    ) {
        garageSection.garageRoad.addNewCarPanelView(service, params, indexView);
    }

    private changeHederCarNumber(garageSection: GarageView) {
        garageSection.garageHeader.changeCountCarNumber(
            garageSection.garageHeader.carsNumber + 1
        );
    }
}
