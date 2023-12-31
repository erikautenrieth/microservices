import { Injectable } from '@nestjs/common';
import {
  AuxiliaryPtoEnum,
  ConfigurationDatabaseDto,
  GearBoxOptions,
  InitializeAlgorithmMicroserviceDto,
  StartingSystemEnum
} from '@wir-schiffen-das/types';
import { AbstractAppService } from '@wir-schiffen-das/nestjs-types';
import { setTimeout } from "timers/promises";

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
      initializeAlgorithmMicroserviceDto.configuration.auxiliary_pto,
      initializeAlgorithmMicroserviceDto.configuration.gear_box_option,
      initializeAlgorithmMicroserviceDto.configuration.starting_system]);

    // Simulate a delay using setTimeout
    await setTimeout(Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000);


    // List of incompatible component sets
    const incompatibleComponents: Set<AuxiliaryPtoEnum | GearBoxOptions | StartingSystemEnum>[] = [
      new Set([AuxiliaryPtoEnum.Alternator, GearBoxOptions.ReverseReductionGearbox]),
      new Set([AuxiliaryPtoEnum.A140AOr190A, GearBoxOptions.ElActuated, StartingSystemEnum.AirStarter]),
    ];
    // Filter incompatible subsets based on relevant selections
    return incompatibleComponents.filter(incompatibleComponent =>
      [...incompatibleComponent].every(component => relevant_Selections.has(component))
    );
  }

  /**
   * Check the compatibility of algorithm configurations.
   * @param initializeAlgorithmMicroserviceDto The DTO containing the algorithm configurations.
   * @returns A promise representing the incompatible component sets.
   */
  async checkKafkaCompactibility(configuration: ConfigurationDatabaseDto): Promise<Set<AuxiliaryPtoEnum | GearBoxOptions | StartingSystemEnum>[]> {

    // Set of relevant selections from the algorithm configurations
    const relevant_Selections = new Set([
      configuration.auxiliary_pto,
      configuration.gear_box_option,
      configuration.starting_system]);

    // Simulate a delay using setTimeout
    await setTimeout(Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000);


    // List of incompatible component sets
    const incompatibleComponents: Set<AuxiliaryPtoEnum | GearBoxOptions | StartingSystemEnum>[] = [
      new Set([AuxiliaryPtoEnum.Alternator, GearBoxOptions.ReverseReductionGearbox]),
      new Set([AuxiliaryPtoEnum.A140AOr190A, GearBoxOptions.ElActuated, StartingSystemEnum.AirStarter]),
    ];
    // Filter incompatible subsets based on relevant selections
    return incompatibleComponents.filter(incompatibleComponent =>
      [...incompatibleComponent].every(component => relevant_Selections.has(component))
    );
  }

}
