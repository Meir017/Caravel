import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { Course, ExternalTool, Shortcut } from '../../core/schemas';
import { NotificationService, ShortcutService } from '../../core/services';
import { CourseService } from '../../core/services/canvas';

@Component({
  selector: 'course-nav',
  templateUrl: './course-nav.component.html',
  styleUrls: ['./course-nav.component.scss']
})
export class CourseNavComponent implements OnInit {
  @Input() course: Course;
  shortcuts: Shortcut[];
  tools: ExternalTool[];

  url: string = "";

  // Shortcut add helper
  showAddShortcutModal = false;
  createQAFormURL: string;
  createQAFormName: string;

  constructor(private courseService: CourseService,
              private location: Location,
              private notificationService: NotificationService,
              private shortcutService: ShortcutService) { }

  ngOnInit(): void {
    this.courseService.listExternalTools(this.course.id, data => this.tools = data);
    this.shortcuts = this.shortcutService.listCourseShortcuts(this.course.id);

    this.shortcutService.shortcuts.subscribe(shortcuts => {
      this.shortcuts = shortcuts[this.course.id];
    });

    // "" for home, "/announcements", etc...
    this.location.onUrlChange(url => {
      this.url = url.replace(`/courses/${this.course.id}`, "");
    });
  }

  // Open modal to add a quick access item
  openAddShortcutModal(): void {
    this.showAddShortcutModal = true;
  }

  // Save new QA Link and close the modal
  addQuickAccessItem(): void {
    if (!this.createQAFormURL || !this.createQAFormName) {
      this.notificationService.notify("Error creating shortcut - please fill in both fields.", 0);
      return;
    }
    
    this.shortcutService.addShortcut(this.course.id, { 
      name: this.createQAFormName, url: this.createQAFormURL });

    this.createQAFormName = null;
    this.createQAFormURL = null;

    this.notificationService.notify("Created shortcut.", 2);
  }

}
