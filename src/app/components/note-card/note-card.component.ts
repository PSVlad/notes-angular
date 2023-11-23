import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements AfterViewInit {
  @Input() title!: string;
  @Input() body!: string;
  @Input() link!: string;

  @Output('del') delEvent: EventEmitter<void> = new EventEmitter<void>();


  @ViewChild('truncator', { static: true }) truncator!: ElementRef<HTMLElement>;
  @ViewChild('bodyText', { static: true }) bodyText!: ElementRef<HTMLElement>;
  @ViewChild('noteP', { static: true }) noteP!: ElementRef<HTMLElement>;

  style!: CSSStyleDeclaration;
  viewableHeight!: number;

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit() {
    if (this.noteP.nativeElement.offsetHeight > this.bodyText.nativeElement.clientHeight) {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }


  onDelButtonClick() {
    this.delEvent.emit();

  }
}
