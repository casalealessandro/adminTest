import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OverlayComponent } from './core/overlay/overlay.component';
import { PopupWrapperComponent } from './core/popup/modal-popup/modal-popup-wrapper/modal-popup-wrapper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PopupWrapperComponent, OverlayComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
