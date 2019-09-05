import { Component } from '@angular/core';

enum Page {
    Main = "main",
    Game = "game",
    Create = "create"
}

const backgrounds = {
    main: "#F44336",
    game: "#4CAF50",
    create: "#2196F3"
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent {
    title = 'cards';
    page: Page = Page.Main;
    positions = {
        main: {
            top: 0,
            left: 0
        },
        game: {
            top: 0,
            left: 100
        },
        create: {
            top: 100,
            left: 0
        }
    }
    onJoin({id}: {id: string}) {
        /*
        Join the room with id
        */
        this.positions.create.left = -100;
        this.positions.main.left = -100;
        this.positions.game.left = 0;
        this.page = Page.Game;
    }
    onCreateMenu() {
        this.positions.create.top = 0;
        this.positions.main.top = -100;
        this.page = Page.Create;
    }
    onCreate(event: {name: string, gameID: string}) {
        /*
        Create new room with name and game
        Join the room that was just created
        */
        this.positions.create.left = -100;
        this.positions.main.left = -100;
        this.positions.game.left = 0;
        setTimeout(() => {
            this.positions.create.top = 100;
            this.positions.main.top = 0;
        }, 1000);
        this.page = Page.Game;
    }
    onCancel() {
        this.positions.create.top = 100;
        this.positions.main.top = 0;
        this.page = Page.Main;
    }
    getBackground() {
        switch (this.page) {
            case Page.Main:
                return backgrounds.main
            case Page.Create:
                return backgrounds.create
            case Page.Game:
                return backgrounds.game
        }
    }
}
