export function nestedRoute(rootPath: string, NestedRouter: any) {
  return function (target: any) {
    console.log("target", target);
    const router = target.getRouter();
    router.use(rootPath, NestedRouter);
  };
}
