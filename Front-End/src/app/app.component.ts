import { Component, ViewChild, ElementRef, Renderer2, OnInit, AfterViewInit } from '@angular/core';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Front-End';
  reader = new FileReader();
  file: File;
  error = false;
  fileSelected = false;

  @ViewChild('fileInput', { static: false }) fileRef: ElementRef;
  @ViewChild('taskFile', { static: false }) fileBlock: ElementRef;
  @ViewChild('image', { static: false }) thumb: ElementRef;

  constructor(private uploadService: UploadService, private renderer: Renderer2) { }

  triggerBrowse() {
    this.fileRef.nativeElement.click();
  }

  onChange() {
    this.error = false;
    this.showThumb(this.fileRef.nativeElement.files);
  }

  showThumb(files) {
    this.file = files.length > 0 ? files[0] : null;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (this.file && allowedExtensions.exec(this.file.name)) {
      this.reader.onloadend = () => {
        this.thumb.nativeElement.src = this.reader.result;
      };
      this.reader.readAsDataURL(this.file);
      this.fileSelected = true;
    } else {
      this.thumb.nativeElement.src = '';
      this.file = null;
      this.error = true;
      this.fileSelected = false;
    }
  }

  overrideDefault(event) {
    event.preventDefault();
  }

  onDragOver() {
    this.renderer.addClass(this.fileBlock.nativeElement, 'dragOver');
  }

  onDragLeave() {
    this.renderer.removeClass(this.fileBlock.nativeElement, 'dragOver');
  }

  onDrop(event) {
    console.log(event);
    this.showThumb(event.dataTransfer.files);
  }

  upload() {
    if (this.file) {
      this.uploadService.uploadImage(this.file).subscribe((res) => {
        console.log(res);
      });
    }
  }

}
