import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
    PosDigicertModuleAsyncOptions,
    PosDigicertModuleOptions,
    PosDigicertModuleOptionsFactory,
} from './interfaces/module-options.interface';
import { PosDigicertDigitalSigning } from './services/pos-digicert-digital-signing.service';
import { SftpService } from './services/sftp.service';
import { POS_DIGICERT_MODULE_OPTIONS } from './constants';

@Global()
@Module({})
export class PosDigicertCoreModule {
    static forRootAsync(options: PosDigicertModuleAsyncOptions): DynamicModule {
        const asyncProviders = this.createAsyncProviders(options);

        return {
            module: PosDigicertCoreModule,
            imports: options.imports || [],
            providers: [
                ...asyncProviders,
                {
                    provide: PosDigicertDigitalSigning,
                    useFactory: (moduleOptions: PosDigicertModuleOptions) => {
                        return new PosDigicertDigitalSigning(moduleOptions.digicertOptions);
                    },
                    inject: [POS_DIGICERT_MODULE_OPTIONS],
                },
                {
                    provide: SftpService,
                    useFactory: (moduleOptions: PosDigicertModuleOptions) => {
                        return new SftpService(moduleOptions.sftpOptions);
                    },
                    inject: [POS_DIGICERT_MODULE_OPTIONS],
                },
                ...(options.providers || []),
            ],
            exports: [PosDigicertDigitalSigning, SftpService],
        };
    }

    private static createAsyncProviders(options: PosDigicertModuleAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }

        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createAsyncOptionsProvider(options: PosDigicertModuleAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: POS_DIGICERT_MODULE_OPTIONS,
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any  */
                useFactory: async (...args: any[]) => {
                    const result = await options.useFactory(...args);
                    return result;
                },
                inject: options.inject || [],
            };
        }

        return {
            provide: POS_DIGICERT_MODULE_OPTIONS,
            useFactory: async (optionsFactory: PosDigicertModuleOptionsFactory) =>
                await optionsFactory.createPosDigicertOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
}