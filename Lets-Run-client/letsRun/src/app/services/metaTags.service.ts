import { Injectable } from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";


@Injectable({ providedIn: "root" })
export class MetaTagsService {

    constructor(private title: Title, private meta: Meta) {

    }

        updateTitle(title: string, description: string, type: string, url: string, image: string ) {

            this.title.setTitle(title);
        
            this.meta.addTag({name: 'description', content: description});

            this.meta.addTag({name: 'twitter:card', content: 'summary'});
            this.meta.addTag({name: 'twitter:site', content: 'Lets Run'});
            this.meta.addTag({name: 'twitter:title', content: title});
            this.meta.addTag({name: 'twitter:description', content: description});
            this.meta.addTag({name: 'twitter:text:description', content: description});
            this.meta.addTag({name: 'twitter:image', content: image});


            this.meta.addTag({property: 'og:type', content: type});
            this.meta.addTag({property: 'og:site_name', content: 'Lets Run'});
            this.meta.addTag({property: 'og:title', content: title});
            this.meta.addTag({property: 'og:description', content: description});
            this.meta.addTag({property: 'og:image', content: image});
            this.meta.addTag({property: 'og:url', content: url});

    }

}