import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.sass']
})
export class CreateGameComponent implements OnInit {

    @Output() cancel: EventEmitter<any> = new EventEmitter();
    @Output() create: EventEmitter<{name: string, gameID: string}> = new EventEmitter();

    name: string = "";
    gameID: string = "";

    games: Array<{name: string, id: string}> = [
        {
            name: "Blackjack",
            id: "000000"
        }
    ];

    constructor() { }

    canCreate(): boolean {
        return this.name.length > 0 && this.gameID.length > 0;
    }

    onCreate() {
        this.create.emit({
            name: this.name,
            gameID: this.gameID
        });
    }

    ngOnInit() {
    }

}
