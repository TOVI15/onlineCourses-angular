import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() lessonContent: string = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.innerText = this.lessonContent || 'No content';
  }
}

