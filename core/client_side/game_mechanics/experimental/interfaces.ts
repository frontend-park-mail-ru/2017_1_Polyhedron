

export interface Scalable {
    scale(scaleFactor: number);
}


export interface Drawable {
    draw(canvas: HTMLCanvasElement);
}

export interface NamedConstructible {
    new(...args: any[]):{};
    name?: string;
}


export interface Constructible {
    new(...args: any[]):{};
}


interface ServiceInfo {
    cls: NamedConstructible;
    args?: any[];
}


export interface ContextConfig {
    services?: ServiceInfo[];
    dataSources?: {};
}
