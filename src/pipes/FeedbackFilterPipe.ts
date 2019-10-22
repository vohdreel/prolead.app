import { Pipe } from '@angular/core';

@Pipe({ name: 'FeedBackFilter' })
export class FeedBackFilterPipe {

    transform(items: any[], values: number[]): any {
        // I am unsure what id is here. did you mean title?
        if (values.length == 0)
            return items;
        return items.filter(item => values.indexOf(item.TipoFeedback) != -1);
    }
}