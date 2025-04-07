import { IBaseComponentParam } from "../../../../../../../../../util/base-component";
import {
    IImgParam,
    ImgComponent,
} from "../../../../../../../../../util/components/img-component";

const CssClasses: { finish: string[] } = {
    finish: ["controller_finish"],
};

export class Finish extends ImgComponent {
    constructor() {
        const finishParam: IBaseComponentParam = {
            classList: CssClasses.finish,
        };
        const finishImgParam: IImgParam = {
            src: "finish.svg",
            alt: "finish img",
        };
        super(finishParam, finishImgParam);
    }
}
