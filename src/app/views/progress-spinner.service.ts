import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { Subject } from 'rxjs';
import { scan, map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProgressSpinnerService {
  private spinSub$: Subject<number> = new Subject();
  private spinnerRef: OverlayRef;
  constructor(private overlay: Overlay) {
    this.spinnerRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });

    this.spinSub$
      .asObservable()
      .pipe(
        scan((acc, next) => {
          if (!next) return 0;
          return acc + next >= 0 ? acc + next : 0;
        }, 0),
        map((val) => val > 0),
        distinctUntilChanged()
      )
      .subscribe((res) => {
        if (res) {
          this.spinnerRef.attach(new ComponentPortal(ProgressSpinnerComponent));
        } else if (this.spinnerRef.hasAttached()) {
          this.spinnerRef.detach();
        }
      });
  }

  show() {
    this.spinSub$.next(1);
  }
  hide() {
    this.spinSub$.next(-1);
  }
  reset() {
    this.spinSub$.next(0);
  }
}
