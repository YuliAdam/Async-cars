import "./button-children.css";
import { IBaseComponentParam } from "../../../../../util/base-component";
import { ComponentChildren } from "../../../../../util/child-component-array";
import { ButtonComponent } from "../../../../../util/components/button-component";
import { Router } from "../../../../router/router";

const CssClasses: { garage: string[]; winner: string[] } = {
    garage: ["nav_garage"],
    winner: ["nav_winner"],
};

const buttonText: { GARAGE: string; WINNER: string } = {
    GARAGE: "To Garage",
    WINNER: "Winners",
};

export class NavButtonChildren extends ComponentChildren<ButtonComponent> {
    constructor(router: Router) {
        super();
        this.addGoToGaragePage(router);
        this.addGoToWinnersPage(router);
    }

    protected getComponentArr(): ButtonComponent[] {
        return [this.createGarageButton(), this.createWinnerButton()];
    }

    private createGarageButton(): ButtonComponent {
        const btnParam: IBaseComponentParam = {
            classList: CssClasses.garage,
            textContent: buttonText.GARAGE,
        };
        return new ButtonComponent(btnParam);
    }
    private createWinnerButton() {
        const btnParam: IBaseComponentParam = {
            classList: CssClasses.winner,
            textContent: buttonText.WINNER,
        };
        return new ButtonComponent(btnParam);
    }

    private addGoToGaragePage(router: Router) {
        this.childArray[0].addComponentEventListener("click", () =>
            router.navigate("index")
        );
    }

    private addGoToWinnersPage(router: Router) {
        this.childArray[1].addComponentEventListener("click", () =>
            router.navigate("winners")
        );
    }
}
