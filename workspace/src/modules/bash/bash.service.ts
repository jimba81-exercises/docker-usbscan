import { Injectable } from '@nestjs/common';
import { exec, execSync } from 'child_process';

@Injectable()
export class BashService {

  // Asynchronous method (exec returns a stream)
  async executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`);
        }
        if (stderr) {
          reject(`stderr: ${stderr}`);
        }
        resolve(stdout);
      });
    });
  }

  // Synchronous method (execSync blocks until command completes)
  executeCommandSync(command: string): string {
    try {
      return execSync(command).toString();
    } catch (error) {
      throw new Error(`Error executing command: ${error.message}`);
    }
  }
}
