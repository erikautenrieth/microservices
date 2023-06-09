import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseSubscriptionService } from './database.subscription.service';
import { AlgorithmState, AlgorithmStateDocument, AlgorithmStateSchema, BaseDatabaseServer } from '@wir-schiffen-das/nestjs-types';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.MONGODB_ATLAS_AZURE_CONNECTION_KEY),
    MongooseModule.forFeatureAsync([
      { 
        name: AlgorithmState.name, 
        useFactory: () => {
          const schema = AlgorithmStateSchema;
          schema.pre<AlgorithmStateDocument>('save',  function (this: AlgorithmStateDocument) {
            this.updateLastUpdated();
          });    
          return schema;
      }
    }
    ]),

  ],
  controllers: [AppController],
  providers: [AppService, DatabaseSubscriptionService, BaseDatabaseServer],
  
})
export class AppModule {}
