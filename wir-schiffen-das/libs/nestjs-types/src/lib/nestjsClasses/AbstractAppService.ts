import { Inject, Injectable } from '@nestjs/common';
import {
  ConfigurationDatabaseDto,
  ConfigurationValidationInitDto,
  InitializeAlgorithmMicroserviceDto,
  UpdateAlgorithmStateDto,
  UpdateKafkaAlgorithmStateDto
} from '@wir-schiffen-das/types';
import { AlgorithmStateDocument } from '../mongoose.shemas';
import { BaseDatabaseServer } from '../database/BaseDatabaseServer';
import { ClientKafka } from '@nestjs/microservices';
import {InfluxDBService} from "../monitor/BaseInfluxService";

@Injectable()
export abstract class AbstractAppService {
  private readonly influxDBService: InfluxDBService;
  constructor(protected baseDatabase: BaseDatabaseServer, @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {this.influxDBService = new InfluxDBService();}

  // Update the algorithm state for a specific database entry
  updateAlgorithmState(dbEntryID: string, updatedPart: UpdateAlgorithmStateDto) {
    return this.baseDatabase.update(dbEntryID, updatedPart);
  }

  // Update the algorithm state for a specific database entry
  async updateKafkaStateAndDB(algorithm: string, configurationValidationInitDto: ConfigurationValidationInitDto, new_State: UpdateAlgorithmStateDto) {
    console.log("start checking Kafka configuration update");

    const kafkaState: UpdateKafkaAlgorithmStateDto = {...new_State, ...configurationValidationInitDto}
    const message = {
      key: configurationValidationInitDto.userId,
      value: JSON.stringify(kafkaState),
    };
    await this.kafkaClient.connect();

    this.kafkaClient.emit('config_update.' + algorithm, message);

    return this.updateAlgorithmState(configurationValidationInitDto.dbId, new_State);
  }

  getDatabaseEntry(dbId: string) {
    return this.baseDatabase.load(dbId);
  }

	getInfluxDBService(): InfluxDBService {
		return this.influxDBService;
	}

  // Retrieve the algorithm state for a specific user
  async getAlgorithmStateForUser(userID: string): Promise<AlgorithmStateDocument | null> {
    return await this.baseDatabase.findByUserId(userID);
  }

  /**
   * Check the compatibility of algorithm configurations.
   * @param initializeAlgorithmMicroserviceDto The DTO containing the algorithm configurations.
   * @returns A promise representing the incompatible component sets.
   */
  abstract checkCompactibility(initializeAlgorithmMicroserviceDto: InitializeAlgorithmMicroserviceDto): Promise<any[]>

  /**
   * Check the compatibility of algorithm configurations.
   * @param initializeAlgorithmMicroserviceDto The DTO containing the algorithm configurations.
   * @returns A promise representing the incompatible component sets.
   */
  abstract checkKafkaCompactibility(configuration: ConfigurationDatabaseDto): Promise<any[]>

}

