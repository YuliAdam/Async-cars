import "./not-found.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../util/base-component";
import { View } from "../../view";
import { Router } from "../../../router/router";
import { ButtonComponent } from "../../../../util/components/button-component";

const CssClasses: { notFound: string[]; text: string[]; back: string[] } = {
    notFound: ["main_not-found"],
    text: ["not-found_text"],
    back: ["not-found_back"],
};

const TEXT_NOT_FOUND = "PAGE NOT FOUND";

export class NotFoundView extends View {
    constructor(router: Router) {
        const notFoundParam: IBaseComponentParam = {
            classList: CssClasses.notFound,
        };
        super(notFoundParam);
        this.configComponent(router);
    }

    private configComponent(router: Router) {
        this.viewComponent.appendChildComponents([
            this.createText(),
            this.createBackBtn(),
        ]);
        this.addEventBackMain(router);
    }

    private createText(): BaseComponent {
        const textParam: IBaseComponentParam = {
            classList: CssClasses.text,
            textContent: TEXT_NOT_FOUND,
        };
        return new BaseComponent(textParam);
    }

    private createBackBtn(): ButtonComponent {
        const backBtnParam: IBaseComponentParam = {
            classList: CssClasses.back,
            textContent: "Back to index page",
        };
        return new ButtonComponent(backBtnParam);
    }

    private addEventBackMain(router: Router) {
        this.viewComponent.addComponentEventListener("click", () =>
            router.navigate("index")
        );
    }
}
