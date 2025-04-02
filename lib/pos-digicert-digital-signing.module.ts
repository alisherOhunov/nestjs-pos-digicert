import { Module, DynamicModule } from '@nestjs/common';
import { PosDigicertModuleAsyncOptions } from './interfaces/module-options.interface';
import { PosDigicertCoreModule } from './pos-digicert-core.module';

@Module({})
export class PosDigicertDigitalSigningModule {
    static forRootAsync(options: PosDigicertModuleAsyncOptions): DynamicModule {
        return {
            module: PosDigicertDigitalSigningModule,
            imports: [PosDigicertCoreModule.forRootAsync(options)],
            exports: [PosDigicertCoreModule],
        };
    }
}

/* THIS IS FOR CONFIGURATION SHARED_MODULE SANSOLS*/

// PosDigicertDigitalSigningModule.forRootAsync({
//     useFactory: (configService: AppConfigService) => {
//         const options = {
//             digicertOptions: {
//                 url: configService.signingDocumentConfig.baseUrl,
//                 projectCode: configService.signingDocumentConfig.projectCode,
//                 organizationId: configService.signingDocumentConfig.organizationId,
//                 fileServerId: configService.signingDocumentConfig.fileServerId,
//                 userId: configService.signingDocumentConfig.userId,
//             },
//             sftpOptions: configService.signingServerFtpConfig,
//         };
//         console.log('Factory returning options:', options);
//         return options;
//     },
//     inject: [AppConfigService],
// }),
