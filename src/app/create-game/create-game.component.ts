import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface GameType {name: string, gameID: string};

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

    private gameTypesCollection: AngularFirestoreCollection<GameType>
    gameTypes: Observable<GameType[]>

    constructor(private afs: AngularFirestore) {
        this.gameTypesCollection = afs.collection<GameType>("gametypes", ref => {
            let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            return query.orderBy("name");
        });
        this.gameTypes = this.gameTypesCollection.valueChanges();
    }

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
