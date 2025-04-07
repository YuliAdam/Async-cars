import { FooterView } from "./view/footer/footer-view";
import { HeaderView } from "./view/header/header-view";
import { Pages, Router, type IRoutes } from "./router/router";
import { MainView } from "./view/main/main-view";
import { NotFoundView } from "./view/main/not-found/not-found";
import { IndexView } from "./view/main/index/index-view";
import { Service } from "./service/service";
import { WinnersView } from "./view/main/winners/winners-view";

export class App {
    private router: Router;
    private service: Service;
    private main: MainView;
    private notFound: NotFoundView;
    private index: IndexView;
    constructor() {
        this.service = new Service();
        this.router = new Router(this.createRoutes());
        this.main = new MainView();
        this.notFound = new NotFoundView(this.router);
        this.index = new IndexView(this.service);
        this.createView(this.router);
    }

    private createView(router: Router): void {
        const headerView: HTMLElement | null = new HeaderView(
            router
        ).getHTMLElement();
        const footerView: HTMLElement | null =
            new FooterView().getHTMLElement();
        App.appendElements([
            headerView,
            this.main.getHTMLElement(),
            footerView,
        ]);
    }

    private static appendElements(el: Array<HTMLElement | null>): void {
        el.forEach((e) => {
            if (e instanceof Node) {
                document.body.append(e);
            }
        });
    }

    private createRoutes(): IRoutes[] {
        return [
            {
                path: Pages.INDEX,
                callBack: () => {
                    this.main.setContent(this.index.viewComponent);
                },
            },
            {
                path: Pages.WINNERS,
                callBack: () => {
                    this.main.setContent(
                        new WinnersView(this.service).viewComponent
                    );
                },
            },
            {
                path: "",
                callBack: () => {
                    this.main.setContent(this.index.viewComponent);
                },
            },
            {
                path: Pages.NOT_FOUND,
                callBack: () => {
                    this.main.setContent(this.notFound.viewComponent);
                },
            },
        ];
    }
}
