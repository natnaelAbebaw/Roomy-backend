import { RolesModel } from "../models/rolesModel";
import { controller } from "../decorators/controllerDecorator";
import { del, get, patch, post } from "../decorators/routeHandlerDecorators";
import { protect } from "../decorators/authDecorators";
import { Controller } from "../services/Controllers";
import { NextFunction, Request, Response, Router } from "express";

@controller("/searchLocation")
export class SearchLocationProxyController extends Controller<any> {
  @get()
  searchLocation() {
    return async function (req: Request, res: Response, next: NextFunction) {
      const { q: query } = req.query;
      const baseUrl = "https://services.gisgraphy.com/fulltext/fulltextsearch";
      const limit = 8;
      const url = `${baseUrl}?q="${query}"&format=json&lang=en&from=1&to=${limit}&placetype=city&allwordsrequired=false`;
      let results = [];
      try {
        const response = await fetch(url);
        const locations = await response.json();
        results = locations["response"]["docs"].map(
          (location: any, i: any) => ({
            id: i,
            address: location["fully_qualified_name"],
            city: location["name_ascii"] ?? location["name"],
            country: location["country_name"],
          })
        );
      } catch (error) {
        console.error("Error:", error);
        console.log("error");
        results = [];
      }

      res
        .status(200)
        .json({ status: "success", length: results.length, results });
    };
  }
}
