export interface Ctx {
  action: {
    name: string;
    arguments: any[];
  };
  store: {
    namespace: string;
    getState: () => object;
  };
}

export interface Plugin {
  (ctx: Ctx, next: Promise<any>): any;
}

export interface ComposeFunc {
  (): Promise<any>;
}

