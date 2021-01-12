import { Injectable } from '@angular/core';

import { APIBaseService } from '../base.service';
import { NotificationService } from '../../notification/notification.service';
import { StorageService } from '../../storage/storage.service';
import { CacheService } from '../../cache/cache.service';

import { Assignment, Submission } from '../../../../core/schemas';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends APIBaseService {

  constructor(storage: StorageService,
              notifService: NotificationService,
              cacheService: CacheService) {
    super("courses", storage, notifService, cacheService);
  }

  async getAssignment(cId: number, aId: number,
      callback: (data: Assignment) => void): Promise<void> {
    const cached = this.getCached(`${cId}/assignments/${aId}`);
    if (cached) callback(JSON.parse(cached));

    this.fetcher(`${cId}/assignments/${aId}`, "GET")
      .then(res => JSON.parse(res))
      .then(res => callback(<Assignment>res))
      .catch(ex => console.error(ex));
  }

  // Given course, assignment, and user ID, get latest submission
  async getLatestSubmission(cId: number, aId: number,
      callback: (data: Submission) => void): Promise<void> {
    const cached = this.getCached(`${cId}/assignments/${aId}/submissions/self`);
    if (cached) callback(JSON.parse(cached));
    
    this.fetcher(`${cId}/assignments/${aId}/submissions/self`, "GET")
      .then(res => JSON.parse(res))
      .then(res => callback(<Submission>res))
      .catch(ex => console.error(ex));
  }

}
