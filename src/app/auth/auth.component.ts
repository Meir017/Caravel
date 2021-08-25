import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StorageService } from '../core/services';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isMobileAuth = false;
  token: string;
  
  constructor(private route: ActivatedRoute,
              private router: Router,
              private storage: StorageService) { }

  ngOnInit(): void {
    const token = this.route.snapshot.params.token;
    if (token && token.length > 60 && token.length < 100) {
      this.token = token;
      this.isMobileAuth = true;
    }
  }

  tryAuthorize(): void {
    // In a real OAuth context, retrieve the token based
    // off of a server running using the developer key.
    // note how our school rejected this key.
    this.storage.set("oauth_token", this.token);
    console.log(this.storage.get("oauth_token"));

    // Redirect back
    this.router.navigateByUrl("/");
  }
}
