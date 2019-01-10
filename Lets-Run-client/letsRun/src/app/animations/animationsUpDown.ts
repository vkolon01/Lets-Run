import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const shrinkUpAndDownAnimation = [
    trigger('dropDownUp', [
        state('down', style({
            'height': '400px'
        })),
        state('up', style({
            'height': '0'
        })),
        transition('down => up', animate('1s', keyframes([
            style({ height: '400px', offset: 0 }),
            style({ height: '300px', offset: 0.4 }),
            style({ height: '200px' , offset: 0.7 }),
            style({ height: '100px', offset: 0.85 }),
            style({ height: '0' , offset: 1 })
        ]))

        ),
        transition('up => down', animate('1s', keyframes([
            style({ height: '0', offset: 0 }),
            style({ height: '100px', offset: 0.4 }),
            style({ height: '200px', offset: 0.7 }),
            style({ height: '300px', offset: 0.85 }),
            style({ height: '400px' , offset: 1 })
        ]))
        )
    ])
];