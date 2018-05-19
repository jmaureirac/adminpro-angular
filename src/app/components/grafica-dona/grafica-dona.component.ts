import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafica-dona',
  templateUrl: './grafica-dona.component.html',
  styles: []
})
export class GraficaDonaComponent implements OnInit {

  @Input() leyenda: string = 'Leyenda'; 
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() type: string = '';

  constructor() { }

  ngOnInit() {
  }

}
