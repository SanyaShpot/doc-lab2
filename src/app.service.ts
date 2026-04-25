import { Injectable } from '@nestjs/common';
import { renderHomePage } from './presentation/views/home.view';

@Injectable()
export class AppService {
  getHomePage(): string {
    return renderHomePage();
  }
}
