export interface IRoutes {
    path: string;
    callBack: () => void;
  }
  
  export const Pages: { INDEX: string; WINNERS: string; NOT_FOUND: string } = {
    INDEX: "index",
    WINNERS: "winners",
    NOT_FOUND: "not-found",
  };
  
  export class Router {
    private routes;
  
    constructor(routes: IRoutes[]) {
      this.routes = routes;
  
      document.addEventListener("DOMContentLoaded", () => {
        const path = this.getCurrentPath();
        this.navigate(path, false);
      });
      window.addEventListener("popstate", this.browserChangeHundler.bind(this));
      window.addEventListener("hashchange", this.browserChangeHundler.bind(this));
    }
  
    public navigate(url: string, addToHistory: boolean = true) {
      const route = this.routes.find((item) => item.path === url);
      if (!route) {
        this.redirectToNotFound();
        return;
      } else {
        route.callBack();
        if (addToHistory) {
          window.history.pushState({}, "", `/${url}`);
        }
      }
    }
  
    private redirectToNotFound(): void {
      const routNotFound = this.routes.find(
        (item) => item.path === Pages.NOT_FOUND,
      );
      if (routNotFound) {
        this.navigate(routNotFound.path);
      }
    }
  
    private browserChangeHundler(): void {
      const path = this.getCurrentPath();
      this.navigate(path,false);
    }
    private getCurrentPath(): string {
      if (window.location.hash) {
        return window.location.hash.slice(1);
      } else {
        return window.location.pathname.slice(1);
      }
    }
  }