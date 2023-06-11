import {Injectable} from '@nestjs/common';
import {
  DieselEngineEnum,
  FuelSystemEnum,
  InitializeAlgorithmMicroserviceDto,
  OilSystemEnum,
  StartingSystemEnum} from '@wir-schiffen-das/types';
import {AbstractAppService} from '@wir-schiffen-das/nestjs-types';
import {setTimeout} from "timers/promises";

@Injectable()
export class AppService extends AbstractAppService {

  /**
   * Check the compatibility of algorithm configurations.
   * @param initializeAlgorithmMicroserviceDto The DTO containing the algorithm configurations.
   * @returns A promise representing the incompatible component sets.
   */
  async checkCompactibility(initializeAlgorithmMicroserviceDto: InitializeAlgorithmMicroserviceDto): Promise<any[]> {

    // Set of relevant selections from the algorithm configurations
    const relevant_Selections = new Set([
      initializeAlgorithmMicroserviceDto.Configurations.diesel_engine,
      initializeAlgorithmMicroserviceDto.Configurations.starting_system,
      initializeAlgorithmMicroserviceDto.Configurations.oil_system,
      initializeAlgorithmMicroserviceDto.Configurations.fuel_system]);

    // Simulate a delay using setTimeout
    await setTimeout(Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000);

    // List of incompatible component sets
    const incompatibleComponents: Set<DieselEngineEnum | StartingSystemEnum | OilSystemEnum | FuelSystemEnum>[] = [
      new Set([DieselEngineEnum.V10, StartingSystemEnum.ElectricStarter]),
      new Set([DieselEngineEnum.V12, OilSystemEnum.DiverterValveForDuplexFilter, FuelSystemEnum.MonitoringFuelLeakage]),
    ];
    // Filter incompatible subsets based on relevant selections
    return incompatibleComponents.filter(incompatibleComponent =>
      [...incompatibleComponent].every(component => relevant_Selections.has(component))
    );
  }

}

