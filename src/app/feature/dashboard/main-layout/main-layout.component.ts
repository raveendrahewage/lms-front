import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from '../../../core/navigation-contents/service/sidebar.service';
import { NavnsideWrapperComponent } from '../../../core/navigation-contents/navnside-wrapper/navnside-wrapper.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, NavnsideWrapperComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  isOpen = false;

  constructor(private _sidebarService: SidebarService) {}

  ngOnInit() {
    this._sidebarService.change.subscribe((isOpen) => {
      this.isOpen = isOpen;
    });
  }
}
