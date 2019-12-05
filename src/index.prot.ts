export interface Context {
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
  (ctx: Context, next: Promise<any>): any;
}

export interface ComposeFunc {
  (): Promise<any>;
}

