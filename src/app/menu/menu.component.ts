import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

    gameID: string = "";

    @Output() join: EventEmitter<any> = new EventEmitter();
    @Output() create: EventEmitter<any> = new EventEmitter();

    constructor() { }

    onIDInput(event) {
        let nextID = event.target.value.toUpperCase();
        if (/^[A-F0-9]*$/.test(nextID)) {
            this.gameID = nextID;
        } else {
            event.target.value = this.gameID;
        }
    }

    onJoinClick() {
        this.join.emit({
            gameID: this.gameID
        });
    }

    onCreateClick() {
        this.create.emit();
    }

    isIDValid() {
        return /^[A-F0-9]{6}$/.test(this.gameID);
    }

    ngOnInit() {
    }

}
