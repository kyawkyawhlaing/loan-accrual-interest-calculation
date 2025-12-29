import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[thousandSeparator]'
})
export class ThousandSeparatorDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {}

    @HostListener('input', ['$event'])
    onInput(event: Event) {
        const input = this.el.nativeElement;
        let value = input.value.replace(/,/g, '');

        // Allow only numbers and one decimal point
        if (!/^\d*\.?\d*$/.test(value)) {
        input.value = input.value.slice(0, -1);
        return;
        }

        // Split integer and decimal parts
        const [integer, decimal] = value.split('.');

        // Format integer part
        const formattedInteger = integer
        ? Number(integer).toLocaleString('en-US')
        : '';

        // Rebuild value
        input.value = decimal !== undefined
        ? `${formattedInteger}.${decimal}`
        : formattedInteger;
    }
}
