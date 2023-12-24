import { NextFunction, Request, Response } from "express";

export function routerHander(method: Function, target: any) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const fuc = await method.bind(target)();
      await fuc(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
