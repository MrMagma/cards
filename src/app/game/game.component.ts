import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SessionService } from '../session.service';
import { Observable } from 'rxjs';
import { switchMap, map, filter, startWith } from "rxjs/operators"
import { DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';

export interface Game {id: string, name: string, game: string}

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {

    @Output() leave: EventEmitter<any> = new EventEmitter<any>();

    gameData: Observable<Game>;

    constructor(private sessionService: SessionService) {
        this.gameData = SessionService.game.pipe(filter(ref => ref != null)).pipe(switchMap((ref: DocumentReference) => {
            return ref.get();
        })).pipe(map((snapshot: DocumentSnapshot<Game>): Game => {
            return {
                id: snapshot.data().id,
                name: snapshot.data().name,
                game: snapshot.data().game
            }
        })).pipe(startWith({
            id: "000000",
            name: "null",
            game: "000000"
        }));
    }

    onLeaveClick() {
        this.leave.emit();
    }

    ngOnInit() {
    }

}
