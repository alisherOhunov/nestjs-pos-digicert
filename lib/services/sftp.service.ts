import * as Client from 'ssh2-sftp-client';
import type { Readable, Writable } from 'stream';

import { SftpError } from '../errors/sftp-server.error';
import { SftpOptions } from '../interfaces/sftp-options.interface';

export class SftpService {
  private client: Client;
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;
  private readonly port: number | undefined;
  private isConnected = false;

  constructor(private config: SftpOptions) {
    this.client = new Client();
    this.host = config.host;
    this.username = config.username;
    this.password = config.password;
    this.port = config.port;
  }

  async upload(fileStream: Readable, destination: string): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.connectToSftp();
      }
      await this.client.put(fileStream, destination);
      return true;
    } catch (error) {
      this.isConnected = false;
      throw new SftpError(`Failed to upload file: ${error}`);
    } finally {
      await this.client.end();
      this.isConnected = false;
    }
  }

  async download(source: string, dst: Writable) {
    try {
      if (!this.isConnected) {
        await this.connectToSftp();
      }
      const fileExists = await this.client.exists(source);
      if (!fileExists) {
        throw new SftpError(`File not found: ${source}`);
      }
      const fileContent = await this.client.get(source, dst);
      return fileContent;
    } catch (error) {
      this.isConnected = false;
      throw new SftpError(`Failed to download file: ${error}`);
    } finally {
      await this.client.end();
      this.isConnected = false;
    }
  }

  async delete(remoteFilePath: string) {
    try {
      if (!this.isConnected) {
        await this.connectToSftp();
      }
      const fileExists = await this.client.exists(remoteFilePath);
      if (!fileExists) {
        throw new SftpError(`File not found: ${remoteFilePath}`);
      }
      const fileContent = await this.client.delete(remoteFilePath);
      return fileContent;
    } catch (error) {
      this.isConnected = false;
      throw new SftpError(`Failed to delete file: ${error}`);
    } finally {
      await this.client.end();
      this.isConnected = false;
    }
  }

  private async connectToSftp(): Promise<void> {
    try {
      await this.client.connect({
        host: this.host,
        username: this.username,
        password: this.password,
        port: this.port,
      });
      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
      throw new SftpError(`Failed to connect to SFTP server: ${error}`);
    }
  }
}
