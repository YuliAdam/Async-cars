import "./header-view.css";
import { BaseComponent } from "../../../util/base-component";
import type { IBaseComponentParam } from "../../../util/base-component";
import { View } from "../view";
import { HeaderNav } from "./nav-view/nav-view";
import { Router } from "../../router/router";

const CssClasses = {
    header: ["header"],
    title: ["header_title"],
};

const TITLE_TEXT: string = "Async Race";

export class HeaderView extends View {
    constructor(router: Router) {
        const headerParam: IBaseComponentParam = {
            tag: "header",
            classList: CssClasses.header,
        };
        super(headerParam);
        this.configView(router);
    }

    protected configView(router: Router): void {
        const h1Param: IBaseComponentParam = {
            tag: "h1",
            textContent: TITLE_TEXT,
            classList: CssClasses.title,
        };
        const navComponent: BaseComponent = new HeaderNav(router).viewComponent;
        this.viewComponent.appendChildComponents([
            navComponent,
            new BaseComponent(h1Param),
        ]);
    }
}
