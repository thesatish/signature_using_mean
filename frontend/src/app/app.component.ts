import { Component } from '@angular/core';
import { SignatureService } from './signature.service';

@Component({
  selector: 'app-root',
  template: `<button (click)="callApi()">Call Secure API</button>`
})
export class AppComponent {
  constructor(private signatureService: SignatureService) { }

  ngOnInit() {
    console.log("hello ");
  }


  callApi() {
    const payload = { userId: 'abc123', amount: 100 };

    this.signatureService.callSecureApi(payload).subscribe({
      next: (res) => console.log('Response:', res),
      error: (err) => console.error('Error:', err)
    });
  }
}
