import { Injectable, HostListener } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, QuerySnapshot, DocumentReference } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from "rxjs/operators";

function generateGameID(): string {
    let digits: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    let id: string = "";
    while (id.length < 6) {
        id += digits[Math.floor(Math.random() * digits.length)];
    }
    return id;
}

function generateName(): string {
    let adjectives = ["Amused", "Delighted", "Glad", "Pleased", "Charmed", "Grateful", "Optimistic", "Content", "Joyful", "Enthusiastic", "Loving", "Marvelous"];
    let nouns = ["Dog", "Cat", "Wombat", "Monkey", "Elephant", "Tiger", "Llama", "Gecko"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

export interface Player {id: string, name: string}
export interface Game {id: string, name: string, game: string}

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    static player: Player = {
        id: localStorage.getItem("player.id") || generateGameID(),
        name: localStorage.getItem("player.name") || generateName()
    };
    public static gameID: BehaviorSubject<string> = new BehaviorSubject<string>("");
    static results: Observable<Game[]>;
    public static game: BehaviorSubject<DocumentReference> = new BehaviorSubject<DocumentReference>(null);
    public gameExists: boolean = false;
    public inGame: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private afs: AngularFirestore) {
        localStorage.setItem("player.id", SessionService.player.id);
        localStorage.setItem("player.name", SessionService.player.name);
        SessionService.results = SessionService.gameID.pipe(
            switchMap((id): Observable<Game[]> => {
                return <Observable<Game[]>>this.afs.collection("games", (ref) => {
                    let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
                    return query.where("id", "==", id);
                }).valueChanges();
            })
        );

        this.afs.collection("games", (ref) => {
            let query : firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            return query.where("playerIds", "array-contains", SessionService.player.id);
        }).get().toPromise().then((result: QuerySnapshot<AngularFirestoreDocument>) => {
            if (result.size == 1) {
                SessionService.game.next(result.docs[0].ref);
                this.gameExists = true;
                this.inGame.next(true);
                SessionService.gameID.next(result.docs[0].id);
            } else {
                SessionService.game.next(null);
            }
        });
        
        SessionService.results.subscribe((results: Game[]) => {
            this.gameExists = results.length == 1;
        });
    }

    public setID(id: string) {
        this.leaveGame();
        SessionService.gameID.next(id);
    }

    public setPlayerName(name: string) {
        SessionService.player.name = name;
        localStorage.setItem("player.name", name);
    }

    public async joinGame() {
        if (SessionService.game.getValue() != null && this.inGame.getValue()) await this.leaveGame();
        SessionService.game.next(this.afs.collection("games").doc(SessionService.gameID.getValue()).ref);
        let players = await SessionService.game.getValue().get().then(ref => {
            return ref.data().players;
        });
        players.push(SessionService.player);
        await SessionService.game.getValue().set({
            players: players,
            playerIds: players.map(player => player.id)
        }, { merge: true }).then(() => {
            this.inGame.next(true);
        });
    }

    public async leaveGame() {
        if (SessionService.game.getValue() != null) {
            let nextPlayers = [];
            let data = await SessionService.game.getValue().get().then(ref => {
                let currentPlayers = ref.data().players;
                for (let player of currentPlayers) {
                    if (player.id != SessionService.player.id) {
                        nextPlayers.push(player);
                    }
                }
                return ref.data();
            });
            await SessionService.game.getValue().set({
                id: data.id,
                name: data.name,
                game: data.game,
                players: nextPlayers,
                playerIds: nextPlayers.map(player => player.id)
            }).then(() => {
                this.inGame.next(false);
            });
        }
    }

    public async createGame(gameData: {name: string, game: string}): Promise<string> {
        const NEXT_ID_OFFSET: number = 15728681;
        let id: string = await this.afs.collection("games").ref.orderBy("id", "desc").limit(1).get().then((snapshot: QuerySnapshot<Game>) => {
            return (parseInt(snapshot.docs[0].data().id, 16) + NEXT_ID_OFFSET).toString(16).padStart(6, "0").toUpperCase();
        });
        // TODO Create game in firestore, then join game
        await this.afs.collection("games").doc(id).set({
            id: id,
            name: gameData.name,
            game: gameData.game,
            players: []
        });
        this.setID(id);
        return id;
    }
}
