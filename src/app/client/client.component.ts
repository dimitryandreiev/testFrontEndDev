import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil} from 'rxjs/operators';


// Models
import { Client } from './../models/client.model';
import { Vehicle } from './../models/vehicle.model';

// Services
import { VehiclesService } from './../services/vehicles.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {

  clientList: Client[] = [];
  selectedClient: Client;
  client: Client;

  vehicleTypes = [
    'carros',
    'motos',
    'caminhoes'
  ];
  typeSelectedVehicle: string;
  brandSelectedVehicle: any;
  modelSelectedVehicle: any;
  yearSelectedVehicle: any;
  isEdit = false;

  vehicleBrandList: any;
  vehicleModelList: any;
  vehicleYearList: any;
  vehicle: any;

  private ngUnsubscribe = new Subject<void>();

  subscribe: Subscription;
  clientId: number = 0;
  deleteClientIndex: number = -1;
  editClientIndex: number = -1;

  loadingBrands = false;
  loadingModels = false;
  loadingYears = false;
  loadingVehicle = false;

  clientModalRef: BsModalRef;
  deleteConfirmModalRef: BsModalRef;

  constructor(
    private vehiclesService: VehiclesService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.vehicleBrandList = [];
    this.typeSelectedVehicle = this.vehicleTypes[0];

    this.getVehiclesBrandList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }

  /* Services */

  /**
   * Get list of brands of vehicle
   */
  getVehiclesBrandList(): void {
    if (!this.typeSelectedVehicle) {
      console.log('Não foi possível carregar a lista de marcas do veículo');
      //TODO modal de erro de campo vázio
      return;
    }

    this.loadingBrands = true;
    const type = this.typeSelectedVehicle;

    this.vehiclesService.getVehiclesBrand(type)
      .subscribe(
        response => {
          this.vehicleBrandList = response;
          this.loadingBrands = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  /**
   * Get list of models of vehicle
   */
  getVehiclesModelList(): void {
    if (
      !this.typeSelectedVehicle
      || !this.brandSelectedVehicle|| !this.brandSelectedVehicle.codigo
    ) {
      console.log('Não foi possível carregar a lista de modelos do veículo');
      //TODO modal de erro de campo vázio
      return;
    }

    this.loadingModels = true;
    const type = this.typeSelectedVehicle;
    const brandId = this.brandSelectedVehicle.codigo;

    this.vehiclesService.getVehiclesModel(type, brandId)
      .subscribe(
        response => {
          this.vehicleModelList = response['modelos'];
          this.loadingModels = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  /**
   * Get list of years of vehicle
   */
  getVehiclesYearList(): void {
    if (
      !this.typeSelectedVehicle
      || !this.brandSelectedVehicle || !this.brandSelectedVehicle.codigo
      || !this.modelSelectedVehicle || !this.modelSelectedVehicle.codigo
    ) {
      console.log('Não foi possível carregar a lista de anos do veículo');
      //TODO modal de erro de campo vázio
      return;
    }

    this.loadingYears = true;
    const type = this.typeSelectedVehicle;
    const brandId = this.brandSelectedVehicle.codigo;
    const modelId = this.modelSelectedVehicle.codigo;

    this.vehiclesService.getVehiclesYear(type, brandId, modelId)
      .subscribe(
        response => {
          this.vehicleYearList = response;
          this.loadingYears = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  /**
   * Get a vehicle
   */
  getVehicle(): void {
    if (
      !this.typeSelectedVehicle
      || !this.brandSelectedVehicle || !this.brandSelectedVehicle.codigo
      || !this.modelSelectedVehicle || !this.modelSelectedVehicle.codigo
      || !this.yearSelectedVehicle || !this.yearSelectedVehicle.codigo
    ) {
      console.log('Não foi possível carregar informações veículo');
      //TODO modal de erro de campo vázio
      return;
    }

    this.loadingVehicle = true;
    const brandId = this.brandSelectedVehicle.codigo;
    const modelId = this.modelSelectedVehicle.codigo;
    const yearId = this.yearSelectedVehicle.codigo;

    this.vehiclesService.getVehicle(this.typeSelectedVehicle, brandId, modelId, yearId)
      .subscribe(
        response => {
          this.vehicle = response;
          console.log(response);
          this.loadingVehicle = false;
        },
        error => {
          console.log(error);
        }
      );
  }

  /* End Services */

  /* Functions */

  /**
   * Open a modal to add or edit a client
   * @param template template of modal to open
   * @param clientIndex index of client in case of edit
   */
  clientFormModal(template: TemplateRef<any>, clientIndex: number = -1) {
    this.client = new Client();
    this.isEdit = false;

    this.brandSelectedVehicle = null;
    this.modelSelectedVehicle = null;
    this.yearSelectedVehicle = null;
    this.vehicle = null;
    this.vehicleModelList = [];
    this.vehicleYearList = [];

    if (clientIndex > -1) {
      this.isEdit = true;
      this.editClientIndex = clientIndex;
      this.client = JSON.parse(JSON.stringify(this.clientList[clientIndex]));
      this.vehicle = this.clientList[clientIndex].vehicle;
    }

    this.typeSelectedVehicle = this.vehicleTypes[0];
    this.clientModalRef = this.modalService.show(template);
  }

  /**
   * On change a type of vehicle
   * @param event
   */
  changeTypeVehicle(event) {
    this.brandSelectedVehicle = null;
    this.modelSelectedVehicle = null;
    this.yearSelectedVehicle = null;
    this.vehicle = null;
    this.vehicleBrandList = [];
    this.vehicleModelList = [];
    this.vehicleYearList = [];

    this.getVehiclesBrandList();
  }

  /**
   * On change a brand of vehicle
   * @param event
   */
  changeBrandVehicle(event) {
    this.modelSelectedVehicle = null;
    this.yearSelectedVehicle = null;
    this.vehicle = null;
    this.vehicleModelList = [];
    this.vehicleYearList = [];

    this.getVehiclesModelList();
  }

  /**
   * On change a model of vehicle
   * @param event
   */
  changeModelVehicle(event) {
    this.yearSelectedVehicle = null;
    this.vehicle = null;
    this.vehicleYearList = [];

    this.getVehiclesYearList();
  }

  /**
   * On change a year of vehicle
   * @param event
   */
  changeYearVehicle(event) {
    this.vehicle = null;
    this.getVehicle();
  }

  /**
   * Add a client to list of clients
   */
  addClient() {
    this.clientId++;
    this.client.id = this.clientId;
    this.client.vehicle = this.vehicle;

    this.clientList.push(this.client);
    this.clientModalRef.hide();
  }

  /**
   * Edit a client of the client list
   */
  editClient() {
    const index = this.editClientIndex;
    this.clientList[index].vehicle = this.vehicle;
    this.clientList[index] = this.client;

    this.clientModalRef.hide();
  }

   /**
    * Open a modal to confirm delete selected client client
    * @param template
    * @param clientIndex
    */
  deleteClient(template: TemplateRef<any>, clientIndex: number = -1) {
    this.deleteClientIndex = clientIndex;
    this.client = this.clientList[clientIndex];

    this.deleteConfirmModalRef = this.modalService.show(template);
  }

  /**
   * Delete a client of the client list
   */
  confirmDeleteClient() {
    this.clientList.splice(this.deleteClientIndex, 1);

    this.deleteConfirmModalRef.hide();
  }

}
