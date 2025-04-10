import { getRandom } from "../../../../../../../../util/random-function";
import { ICreateCarParams } from "../../../../../../../service/garage-service/garage-service";

const carsName: string[] = [
    "Ford",
    "Tesla",
    "fiat",
    "Jeep",
    "Mercedes",
    "BMV",
    "Porshe",
    "Nisan",
    "Volvo",
    "Subaru",
    "Land Rover",
    "Audi",
];
const model: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function getRandomCarsArr(): ICreateCarParams[] {
    const arr: ICreateCarParams[] = [];
    while (arr.length < 100) {
        const randomName = carsName[getRandom(0, carsName.length)];
        const carModel = model[getRandom(0, model.length)];
        const carColor = getRandomColor();
        const carParams: ICreateCarParams = {
            name: randomName + " " + carModel,
            color: carColor,
        };
        if (
            !arr.some((el) => JSON.stringify(el) === JSON.stringify(carParams))
        ) {
            arr.push(carParams);
        }
    }
    return arr;
}
