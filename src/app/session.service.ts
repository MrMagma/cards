import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { switchMap } from "rxjs/operators";

export interface Game {id: string, name: string, game: string};

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    gameID: Subject<string> = new Subject<string>();
    results: Observable<Game[]>;
    public gameExists: boolean = false;

    constructor(private afs: AngularFirestore) {
        this.results = this.gameID.pipe(
            switchMap((id): Observable<Game[]> => {
                return <Observable<Game[]>>this.afs.collection("games", (ref) => {
                    let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                    return query.where("id", "==", id);
                }).valueChanges();
            })
        );
        
        this.results.subscribe((results: Game[]) => {
            this.gameExists = results.length == 1;
        });
    }

    public setID(id: string) {
        this.gameID.next(id);
    }
}
