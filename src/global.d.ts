declare module "*.png" {
  const value: any;
  export = value;
}

declare module "*.css" {
  const value: any;
  export = value;
}

declare module "cerebro-tools" {
  export const memoize: (
    fn: any,
    options: {
      length: boolean,
      promise: 'then',
      maxAge: number,
      preFetch: boolean
    }) => {
      clear: () => {},
      (): Promise<typeof fn>
    }
}
