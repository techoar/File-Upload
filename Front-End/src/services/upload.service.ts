import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class UploadService {

    constructor(private http: HttpClient) { }

    uploadImage(fileToUpload: File): Observable<any> {
        console.log(fileToUpload);
        const endpoint = `http://localhost:3000/upload`;
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        return this.http.post(endpoint, formData);
    }
}
