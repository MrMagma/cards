import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

    gameID: string = "";

    constructor() { }

    onIDChange() {

    }

    isIDValid() {
        return /^[a-fA-F0-9]{6}$/.test(this.gameID);
    }

    ngOnInit() {
    }

}
