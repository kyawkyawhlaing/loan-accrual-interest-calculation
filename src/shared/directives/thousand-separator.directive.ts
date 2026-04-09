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

        this.formatValue(value, false);
    }

    @HostListener('blur')
    onBlur() {
        const input = this.el.nativeElement;
        const value = input.value.replace(/,/g, '');

        if (!value) {
            return;
        }

        this.formatValue(value, true);
    }

    private formatValue(value: string, padDecimals: boolean) {
        const [integerPart, decimalPart] = value.split('.');
        const integer = integerPart || '0';
        const formattedInteger = Number(integer).toLocaleString('en-US');

        if (decimalPart !== undefined) {
            const trimmedDecimal = decimalPart.slice(0, 2);
            const paddedDecimal = padDecimals
                ? trimmedDecimal.padEnd(2, '0')
                : trimmedDecimal;
            this.el.nativeElement.value = `${formattedInteger}.${paddedDecimal}`;
            return;
        }

        this.el.nativeElement.value = padDecimals
            ? `${formattedInteger}.00`
            : formattedInteger;
    }
}
