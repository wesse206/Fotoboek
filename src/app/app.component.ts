import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import oneDriveAPI  from 'onedrive-api'

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  profile!: ProfileType;
  file : any

  FotoBoek: any[] = [
    [
      ['1', '3'],
      []
    ],
  ]
  StockFotos: any[] = [
    [
    [false, false],
    []
    ]
  ]
  
  constructor(private authService: MsalService, private broadcastService: MsalBroadcastService, private http: HttpClient) { }

  isIframe = false
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {

    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
      this.getProfile();
    })
  }

  getProfile() {
    this.http.get('https://graph.microsoft.com/v1.0/me')
      .subscribe(profile => {
        this.profile = profile;
      });
  }
  getFiles() {
    this.http.post('https://durbanvillehs-my.sharepoint.com/_layouts/15/FilePicker.aspx', { "selection": {"mode":"single"}})
      .subscribe(file => {
        this.file = file;
        console.log(file)
      });
  }
  login() {
    this.authService.loginRedirect();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

/*
id: 'aba52fa6-01aa-4a40-9a49-49e518c346e7',
secret: 'quJ8Q~t5~t_CNFemEYzMXZizZ.fLXIvfFrV56bZL'
*/

  showModal = 'none'
  fotos = new FormControl('')
  page = 0
  part = 0

  addImage(page: number, part: number) {
      this.showModal = 'block'
      this.page = page
      this.part = part
  }
  removeImage(page: number, part: number,image: string) {
    const index = this.FotoBoek[page][part].indexOf(image, 0)
    this.FotoBoek[page][part].splice(index, 1)
    this.StockFotos[page][part].splice(index, 1)
  }
  newImage(fotoNommer: string) {
    this.FotoBoek[this.page][this.part].push(fotoNommer)
    this.StockFotos[this.page][this.part].push(false)
    this.showModal = 'none'
  }

  imageSrc: any
  newCustomImage(inputFile: any) {
    var input: File = inputFile.files[0]
    const reader = new FileReader();
    reader.onload = e => {
      this.imageSrc = reader.result 
      this.FotoBoek[this.page][this.part].push(reader.result)
    }
    reader.readAsDataURL(input)
    

    this.StockFotos[this.page][this.part].push(true)

  }

  addPage() {
    this.FotoBoek.push([[], []])
    this.StockFotos.push([[], []])
  }
  i: number
  removePage(page:number) {
    this.i = -1
    this.FotoBoek.splice(page, 1)
    this.StockFotos.splice(page, 1)
  }
}


