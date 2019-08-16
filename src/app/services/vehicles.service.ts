// Angular Imports
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {  HttpClient } from '@angular/common/http';
import { map} from 'rxjs/operators';


//Models
import { Vehicle } from './../models/vehicle.model';

@Injectable()
export class VehiclesService  {

  subscribe: Subscription;

  constructor(
    private httpClient: HttpClient
  )  { }

  public getVehiclesBrand(type: string) {
    const url = `https://parallelum.com.br/fipe/api/v1/` + type + `/marcas`;

    return this.httpClient.get(url);
  }

  public getVehiclesModel(type: string, brandId: number) {
    const url = `https://parallelum.com.br/fipe/api/v1/` + type + `/marcas/` + brandId + `/modelos`;

    return this.httpClient.get(url);
  }

  public getVehiclesYear(type: string, brandId: number, modelId: number) {
    const url = `https://parallelum.com.br/fipe/api/v1/` + type + `/marcas/` + brandId + `/modelos/` + modelId + `/anos`;

    return this.httpClient.get(url);
  }

  public getVehicle(type: string, brandId: number, modelId: number, yearId: number) {
    const url = `https://parallelum.com.br/fipe/api/v1/` + type + `/marcas/` + brandId + `/modelos/`  + modelId + `/anos/`  + yearId;

    return this.httpClient.get(url);
  }

}
