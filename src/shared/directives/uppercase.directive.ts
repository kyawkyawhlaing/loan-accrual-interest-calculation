import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    input.value = input.value.toUpperCase();

    // Preserve cursor position
    input.setSelectionRange(start, end);
  }
}
