import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-file-upload-main',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './file-upload-main.component.html',
  styleUrls: ['./file-upload-main.component.css'],
})
export class FileUploadMainComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
}
