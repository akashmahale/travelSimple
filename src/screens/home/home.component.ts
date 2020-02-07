import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {
    this.inputForm = this.formBuilder.group({
      from: new FormControl('', [Validators.required, Validators.minLength(3)]),
      to: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }
  inputForm: FormGroup;
  allLocations = [];
  selectedValue1;
  selectedValue2;
  locationMap = [];
  lines = [];
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  number;

  ngOnInit() {
    document.body.appendChild(this.svg);
    window.onresize = () => {
      this.reportWindowSize();
    };
  }

  async onSubmit(data) {
    await this.saveLocation({
      ...data,
      from: data.from.toUpperCase(),
      to: data.to.toUpperCase()
    });
    this.sortLevels();
    this.inputForm.reset();
  }

  saveLocation(data) {
    return new Promise(resolve => {
      this.allLocations.push(data);
      resolve(true);
      return;
    });
  }

  sortLevels() {
    this.allLocations.forEach((x, i) => {
      if (this.allLocations[i + 1]) {
        if (this.allLocations[i + 1].from === x.from) {
          this.allLocations[i].level = 2;
          this.allLocations[i + 1].level = 2;
        }
        if (this.allLocations[i + 1].from !== x.to) {
          this.allLocations[i + 1].arrow = true;
        }
      }

      setTimeout(() => {
        if (i === 0) {
          return;
        }
        const remLine = document.getElementById(`line${i}`);
        if (remLine) {
          document.getElementsByTagName('svg')[0].removeChild(remLine);
        }

        const newLine = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );

        const docu = document.getElementById(`route${i}`);
        const docu2 = document.getElementById(`route${i - 1}`);

        if (!docu2) {
          return;
        }

        const doc1 = docu.getBoundingClientRect();
        const doc2 = docu2.getBoundingClientRect();
        newLine.setAttribute('id', `line${i}`);
        newLine.setAttribute('x1', (doc2.right + 4).toString());
        newLine.setAttribute('y1', (doc2.top + doc2.height / 2).toString());
        newLine.setAttribute('x2', (doc1.left - 2).toString());
        newLine.setAttribute('y2', (doc1.top + doc1.height / 2).toString());
        newLine.setAttribute('stroke', 'grey');

        this.svg.appendChild(newLine);
      }, 10);
    });
  }

  reportWindowSize() {
    this.sortLevels();
  }
}
