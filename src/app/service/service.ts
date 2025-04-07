import { EngineService } from "./engine-service/engine-service";
import {
    GarageService,
    ICreateCarParams,
} from "./garage-service/garage-service";
import { WinnersService } from "./winners-service/winners-service";

const DOMAIN_NAME: string = "http://127.0.0.1:3000";
const ENGINE_PATH: string = "/engine";
const GARAGE_PATH: string = "/garage";
const WINNERS_PATH: string = "/winners";

export class Service {
    public garageService: GarageService;
    public winnersService: WinnersService;
    public engineService: EngineService;
    constructor() {
        this.garageService = new GarageService(Service.createUrl(GARAGE_PATH));
        this.engineService = new EngineService(Service.createUrl(ENGINE_PATH));
        this.winnersService = new WinnersService(
            Service.createUrl(WINNERS_PATH)
        );
    }
    private static createUrl(path: string) {
        return `${DOMAIN_NAME}${path}`;
    }
}
