import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, Input } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements AfterViewInit {
  @Input() title!: string;
  @Input() body!: string;


  @ViewChild('truncator', { static: true }) truncator!: ElementRef<HTMLElement>;
  @ViewChild('bodyText', { static: true }) bodyText!: ElementRef<HTMLElement>;
  @ViewChild('noteP', { static: true }) noteP!: ElementRef<HTMLElement>;

  style!: CSSStyleDeclaration;
  viewableHeight!: number;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    this.style = window.getComputedStyle(this.bodyText.nativeElement, null);
    this.viewableHeight = parseInt(this.style.getPropertyValue("height"), 10);
    if (this.noteP.nativeElement.offsetHeight > this.bodyText.nativeElement.clientHeight) {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }
}
