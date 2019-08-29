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

    onIDInput(event) {
        let nextID = event.target.value.toUpperCase();
        if (/^[A-F0-9]*$/.test(nextID)) {
            this.gameID = nextID;
        } else {
            event.target.value = this.gameID;
        }
    }

    onJoinClick() {

    }

    onCreateClick() {
        console.log("Create");
    }

    isIDValid() {
        return /^[A-F0-9]{6}$/.test(this.gameID);
    }

    ngOnInit() {
    }

}
