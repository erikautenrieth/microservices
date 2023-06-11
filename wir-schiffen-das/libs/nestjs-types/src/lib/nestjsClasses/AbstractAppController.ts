import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';

import {
  AlgorithmStateEnum,
  CheckAlgorithmStateDto,
  InitializeAlgorithmMicroserviceDto,
  ReturnAlgorithmStateDto,
} from "@wir-schiffen-das/types";
import { AbstractAppService } from './AbstractAppService';

export abstract class AbstractAppController {

  constructor(private readonly appService: AbstractAppService) {
  }

  /**
   * Handles the POST request for checking configuration.
   *
   * @param initializeAlgorithmMicroserviceDto - The data object containing the configuration to be checked.
   */
  @Post("CheckConfiguration")
  @UsePipes(new ValidationPipe())
  async CheckConfiguration(@Body() initializeAlgorithmMicroserviceDto: InitializeAlgorithmMicroserviceDto) {

    console.log("start checking configuration");
    this.checkConfigurationHelper(initializeAlgorithmMicroserviceDto);

  }
  /**
   * Helper method for checking configuration.
   *
   * @param initializeAlgorithmMicroserviceDto - The data object containing the configuration to be checked.
   */
  async checkConfigurationHelper(initializeAlgorithmMicroserviceDto: InitializeAlgorithmMicroserviceDto) {
    console.log("start checking configuration");
    console.log("start checking configuration algorithm");

    // Update the algorithm state to "running"
    await this.appService.updateAlgorithmState(initializeAlgorithmMicroserviceDto.dbId, {engineState: AlgorithmStateEnum.running});
    // Check compatibility of components
    const incompatibleComponents = await this.appService.checkCompactibility(initializeAlgorithmMicroserviceDto);

    if (incompatibleComponents.length > 0) {
      // Update the algorithm state to "failed" with incompatible components
      await this.appService.updateAlgorithmState(initializeAlgorithmMicroserviceDto.dbId, {
        engineState: AlgorithmStateEnum.failed,
        incompactibleConfigurations: incompatibleComponents
      });
    } else {
      // Update the algorithm state to "ready"
      await this.appService.updateAlgorithmState(initializeAlgorithmMicroserviceDto.dbId, {engineState: AlgorithmStateEnum.ready});
    }
  }

  /**
   * Handles the POST request for getting the algorithm status.
   *
   * @param checkStatus - The data object containing the user ID to check the algorithm status.
   * @returns A Promise resolving to the algorithm state and incompatible components.
   */
  @Post("Status")
  @UsePipes(new ValidationPipe())
  async Status(@Body() checkStatus: CheckAlgorithmStateDto): Promise<ReturnAlgorithmStateDto> {

    const algorithmState = await this.appService.getAlgorithmStateForUser(checkStatus.userID);
    return {
      userID: checkStatus.userID,
      algorithmState: algorithmState?.engineState ? algorithmState.engineState : AlgorithmStateEnum.notStarted,
      incompatibleComponents: algorithmState?.incompactibleConfigurations ? algorithmState.incompactibleConfigurations : []
    };

  }
}
