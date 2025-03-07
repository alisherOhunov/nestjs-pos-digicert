import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { PosDigicertOptions } from './pos-digicert-options.interface';
import { SftpOptions } from './sftp-options.interface';

export interface PosDigicertModuleOptions {
    digicertOptions: PosDigicertOptions;
    sftpOptions: SftpOptions;
}

export interface PosDigicertModuleOptionsFactory {
    createPosDigicertOptions(): Promise<PosDigicertModuleOptions> | PosDigicertModuleOptions;
}

export interface PosDigicertModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<PosDigicertModuleOptionsFactory>;
    useClass?: Type<PosDigicertModuleOptionsFactory>;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    useFactory?: (...args: any[]) => Promise<PosDigicertModuleOptions> | PosDigicertModuleOptions;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any*/
    inject?: any[];
    providers?: Provider[];
}