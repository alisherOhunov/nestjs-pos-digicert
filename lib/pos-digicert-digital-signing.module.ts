import { Module, DynamicModule } from '@nestjs/common';
import { PosDigicertModuleAsyncOptions } from './interface/module-options.interface';
import { PosDigicertCoreModule } from './pos-digicert-core.module';
import { PosDigicertDigitalSigning } from './services/pos-digicert-digital-signing.service';
import { SftpService } from './services/sftp.service';

@Module({})
export class PosDigicertDigitalSigningModule {
    static forRootAsync(options: PosDigicertModuleAsyncOptions): DynamicModule {
        return {
            module: PosDigicertDigitalSigningModule,
            imports: [PosDigicertCoreModule.forRootAsync(options)],
            exports: [PosDigicertDigitalSigning, SftpService],
        };
    }
}
