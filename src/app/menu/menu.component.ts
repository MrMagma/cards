import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { SessionService } from '../session.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

    gameID: string = "";

    @Output() join: EventEmitter<any> = new EventEmitter();
    @Output() create: EventEmitter<any> = new EventEmitter();

    constructor(private sessionService: SessionService) {
        this.sessionService.inGame.subscribe((value: boolean) => {
            if (!value) this.gameID = "";
        });
    }

    onIDInput(event) {
        let nextID = event.target.value.toUpperCase();
        if (/^[A-F0-9]*$/.test(nextID)) {
            this.gameID = nextID;
            this.sessionService.setID(this.gameID);
        } else {
            event.target.value = this.gameID;
        }
    }

    onJoinEvent() {
        if (this.isIDValid()) {
            this.join.emit({
                gameID: this.gameID
            });
            this.sessionService.joinGame();
        }
    }

    onCreateClick() {
        this.create.emit();
    }

    isIDValid() {
        return /^[A-F0-9]{6}$/.test(this.gameID) && this.sessionService.gameExists;
    }

    ngOnInit() {
    }

}
