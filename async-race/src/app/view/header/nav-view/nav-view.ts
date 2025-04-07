import "./nav-view.css";
import { type IBaseComponentParam } from "../../../../util/base-component";
import { View } from "../../view";
import { NavButtonChildren } from "./button-children/button-children";
import { ButtonComponent } from "../../../../util/components/button-component";
import { Router } from "../../../router/router";

const CssClasses: { nav: string[] } = {
    nav: ["header_nav"],
};

export class HeaderNav extends View {
    constructor(router: Router) {
        const navParam: IBaseComponentParam = {
            classList: CssClasses.nav,
        };
        super(navParam);
        this.configView(router);
    }

    private configView(router: Router) {
        this.viewComponent.appendChildComponents(
            this.createChildrenComponents(router)
        );
    }

    private createChildrenComponents(router: Router): ButtonComponent[] {
        return new NavButtonChildren(router).childArray;
    }
}
