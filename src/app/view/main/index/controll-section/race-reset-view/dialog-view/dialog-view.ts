import "./dialog-view.css";
import {
    BaseComponent,
    IBaseComponentParam,
} from "../../../../../../../util/base-component";
import { ButtonComponent } from "../../../../../../../util/components/button-component";
import { View } from "../../../../../view";

const CssClasses: { mainDialog: string[]; text: string[]; close: string[] } = {
    mainDialog: ["race_dialog"],
    text: ["dialog_text"],
    close: ["dialog_close"],
};

export class DialogView extends View {
    constructor() {
        const dialogParams: IBaseComponentParam = {
            tag: "dialog",
            classList: CssClasses.mainDialog,
        };
        super(dialogParams);
    }

    public setDialog(name: string, timeInSec: number) {
        this.viewComponent.removeChildren();
        const textParams: IBaseComponentParam = {
            tag: "p",
            classList: CssClasses.text,
            textContent: `Winner is ${name}. Time: ${timeInSec.toFixed(1)}sec`,
        };
        const textEl: BaseComponent = new BaseComponent(textParams);
        const btnParams: IBaseComponentParam = {
            classList: CssClasses.close,
            textContent: "Close",
        };
        const btnComponent: ButtonComponent = new ButtonComponent(btnParams);
        DialogView.closeDialog(btnComponent);
        this.viewComponent.appendChildComponents([textEl, btnComponent]);
    }

    private static closeDialog(el: BaseComponent): void {
        const overDiv: HTMLElement | null = el.getElement();
        if (overDiv) {
            overDiv.addEventListener("click", () => {
                const dialog: HTMLElement | null = el.getParentComponent();
                if (dialog && dialog instanceof HTMLDialogElement) {
                    dialog.classList.add("open");
                    dialog.close();
                    setTimeout(() => {
                        dialog.classList.remove("open");
                    }, 100);
                }
            });
        }
    }

    public showDialog() {
        const dialogElem: HTMLElement | null = this.viewComponent.getElement();
        if (
            dialogElem instanceof HTMLDialogElement &&
            !dialogElem.classList.contains("open")
        ) {
            dialogElem.showModal();
        }
    }
}
