import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  FotoBoek: any[] = [
    ['1', '3'],
    []
  ]
  StockFotos: any[] = [
    [false, false],
    []
  ]

  showModal = 'none'
  fotos = new FormControl('')
  page = 0
  addImage(page: number) {
      this.showModal = 'block'
      this.page = page
  }
  removeImage(page: number, image: string) {
    const index = this.FotoBoek[page].indexOf(image, 0)
    this.FotoBoek[page].splice(index, 1)
    this.StockFotos[page].splice(index, 1)
  }
  newImage(fotoNommer: string) {
    this.FotoBoek[this.page].push(fotoNommer)
    this.StockFotos[this.page].push(false)
    this.showModal = 'none'
  }

  imageSrc: any
  newCustomImage(inputFile: any) {
    var input: File = inputFile.files[0]
    const reader = new FileReader();
    reader.onload = e => {
      this.imageSrc = reader.result 
      this.FotoBoek[this.page].push(reader.result)
    }
    reader.readAsDataURL(input)
    

    this.StockFotos[this.page].push(true)

  }

  addPage() {
    this.FotoBoek.push([])
    this.StockFotos.push([])
  }
  removePage(page:number) {
    this.FotoBoek.splice(page, 1)
    this.StockFotos.splice(page, 1)
  }
}


