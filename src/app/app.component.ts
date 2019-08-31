import { Component } from '@angular/core';

enum Page {
    Main = "main",
    Game = "game",
    Create = "create"
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
}
