import {}
const carsNam: string[] = [
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


export function getRandomCarsArr(){
    const arr = [];
    while(arr.length<100){
        const randomName = `${}`
    }
}

