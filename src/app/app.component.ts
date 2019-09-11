import { Component } from '@angular/core';
import { SessionService } from './session.service';

enum MenuPage {
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
    menuPage: MenuPage = MenuPage.Main;
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
    constructor(private sessionService: SessionService) {
        sessionService.inGame.subscribe((value: boolean) => {
            if (value) this.setPage(MenuPage.Game);
            else this.setPage(MenuPage.Main);
        });
    }
    
    setPage(page: MenuPage) {
        switch (page) {
            case MenuPage.Main:
                if (this.menuPage == MenuPage.Create) {
                    this.positions.create.top = 100;
                    this.positions.main.top = 0;
                } else if (this.menuPage == MenuPage.Game) {
                    this.positions.game.left = 100;
                    this.positions.main.left = 0;
                    this.positions.create.left = 0;
                }
                break;
            case MenuPage.Create:
                if (this.menuPage == MenuPage.Main) {
                    this.positions.create.top = 0;
                    this.positions.main.top = -100;
                }
                break;
            case MenuPage.Game:
                if (this.menuPage == MenuPage.Create) {
                    this.positions.create.left = -100;
                    this.positions.main.left = -100;
                    this.positions.game.left = 0;
                    setTimeout(() => {
                        this.positions.create.top = 100;
                        this.positions.main.top = 0;
                    }, 1000);
                    this.menuPage = MenuPage.Game;
                } else if (this.menuPage == MenuPage.Main) {
                    this.positions.create.left = -100;
                    this.positions.main.left = -100;
                    this.positions.game.left = 0;
                }
        }
        this.menuPage = page;
    }
    onJoin({id}: {id: string}) {
        /*
        Join the room with id
        */
        this.setPage(MenuPage.Game);
    }
    onLeave() {
        this.sessionService.leaveGame();
    }
    onCreateMenu() {
        this.setPage(MenuPage.Create);
    }
    onCreate(event: {name: string, gameID: string}) {
        /*
        Create new room with name and game
        Join the room that was just created
        */
        this.setPage(MenuPage.Game);
    }
    onCancel() {
        this.setPage(MenuPage.Main);
    }
    getBackground() {
        switch (this.menuPage) {
            case MenuPage.Main:
                return backgrounds.main
            case MenuPage.Create:
                return backgrounds.create
            case MenuPage.Game:
                return backgrounds.game
        }
    }
}
