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
    onJoin(evt) {
        console.log(evt);
    }
    onCreate() {
        this.page = Page.Create;
    }
    onCancel() {
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
