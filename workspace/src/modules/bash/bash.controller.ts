import { Controller, Get, Query } from '@nestjs/common';
import { BashService } from './bash.service';

@Controller('bash')
export class BashController {
  constructor(private readonly bashService: BashService) {}

  @Get('execute')
  async executeBash(@Query('command') command: string): Promise<string> {
    if (!command) {
      return 'No command provided.';
    }
    try {
      const result = await this.bashService.executeCommand(command);
      return `Command output: ${result}`;
    } catch (error) {
      return `Error: ${error}`;
    }
  }

  @Get('execute-sync')
  executeBashSync(@Query('command') command: string): string {
    if (!command) {
      return 'No command provided.';
    }
    try {
      const result = this.bashService.executeCommandSync(command);
      return `Command output: ${result}`;
    } catch (error) {
      return `Error: ${error.message}`;
    }
  }
}
