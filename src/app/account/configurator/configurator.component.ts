import { Component, OnInit } from '@angular/core';

import {
  CacheService,
  ConfigurationService,
  NotificationService
} from '../../core/services';
import { Configuration } from '../../core/schemas';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit {
  configuration: Configuration;

  constructor(private cache: CacheService,
              private config: ConfigurationService,
              private notif: NotificationService) { }

  ngOnInit(): void {
    this.config.config.subscribe(data => {
      this.configuration = data;

      // Change app theme if it is updated
      const theme = this.configuration["caravel"]["theme"].value;
      document.documentElement.setAttribute('theme', theme);
    });
  }

  // Updates an item in the cache
  upd(scope: string, key: string, val: any): void {
    this.config.set(scope, key, val);
  }

  // Clear all user cache. Does not sign user out.
  async clearCache(): Promise<void> {
    const freed = this.cache.clear();
    await this.config.updateApp();
    this.configuration = this.config.getAll();
    this.notif.notify(`Cleared cache and freed ${freed}KB.`, 2);
  }

  // Reset config in localstorage. Does not sign user out.
  async resetConfig(): Promise<void> {
    await this.config.resetToDefault();
    await this.config.updateApp();
    this.configuration = this.config.getAll();
    this.notif.notify('Reset configuration to default.', 2);
  }

}
