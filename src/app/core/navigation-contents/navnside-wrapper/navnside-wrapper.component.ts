import { Component, OnInit } from '@angular/core';
import { TopNavigationComponent } from '../top-navigation/top-navigation.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navnside-wrapper',
  standalone: true,
  imports: [TopNavigationComponent, SidebarComponent],
  templateUrl: './navnside-wrapper.component.html',
  styleUrls: ['./navnside-wrapper.component.css'],
})
export class NavnsideWrapperComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
