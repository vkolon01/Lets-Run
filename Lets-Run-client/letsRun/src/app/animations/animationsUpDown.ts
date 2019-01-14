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

export const navBarAnimationFromLeft = [
    trigger('horizontalToRight', [
        state('horizontal', style({
            'transform': 'rotateZ(0deg) translateY(0px) translateX(0px)'
        })),
        state('atAngel', style({
            'transform': 'rotateZ(-403deg) translateY(8px) translateX(-7px)'
        })),
        transition('horizontal => atAngel', animate('.5s', keyframes([
            style({ transform: 'rotateZ(0deg) translateY(0px) translateX(0px)', offset: 0 }),
            style({ transform: 'rotateZ(-147deg) translateY(-4px) translateX(18px)', offset: 0.2 }),
            style({ transform: 'rotateZ(-228deg) translateY(-6px) translateX(34px)', offset: 0.4 }),
            style({ transform: 'rotateZ(-316deg) translateY(9px) translateX(34px)', offset: 0.6 }),
            style({ transform: 'rotateZ(-403deg) translateY(8px) translateX(15px)', offset: 0.8 }),
            style({ transform: 'rotateZ(-403deg) translateY(8px) translateX(-7px)', offset: 1 }),
        ]))

        ),
        transition('atAngel => horizontal', animate('.5s', keyframes([
            style({ transform: 'rotateZ(-403deg) translateY(8px) translateX(-7px)', offset: 0 }),
            style({ transform: 'rotateZ(-403deg) translateY(8px) translateX(15px)', offset: 0.2 }),
            style({ transform: 'rotateZ(-316deg) translateY(9px) translateX(34px)', offset: 0.4 }),
            style({ transform: 'rotateZ(-228deg) translateY(-6px) translateX(34px)', offset: 0.6 }),
            style({ transform: 'rotateZ(-147deg) translateY(-4px) translateX(18px)', offset: 0.8 }),
            style({ transform: 'rotateZ(0deg) translateY(0px) translateX(0px)', offset: 1 }),
        ]))
        )
    ]),
    trigger('horizontalToLeft', [
        state('horizontal', style({
            'transform': 'rotateZ(0deg) translateY(0px) translateX(0px)'
        })),
        state('atAngel', style({
            'transform': 'rotateZ(223deg) translateY(9px) translateX(8px)'
        })),
        transition('horizontal => atAngel', animate('.5s', keyframes([
            style({ transform: 'rotateZ(0deg) translateY(0px) translateX(0px)', offset: 0 }),
            style({ transform: 'rotateZ(44deg) translateY(-8px) translateX(19px)', offset: 0.2 }),
            style({ transform: 'rotateZ(136deg) translateY(9px) translateX(19px)', offset: 0.4 }),
            style({ transform: 'rotateZ(223deg) translateY(9px) translateX(31px)', offset: 0.6 }),
            style({ transform: 'rotateZ(223deg) translateY(9px) translateX(31px)', offset: 0.8 }),
            style({ transform: 'rotateZ(223deg) translateY(9px) translateX(8px)', offset: 1 }),
        ]))

        ),
        transition('atAngel => horizontal', animate('.5s', keyframes([
            style({ transform: 'rotateZ(223deg) translateY(9px) translateX(8px)', offset: 0 }),
            style({ transform: 'rotateZ(223deg) translateY(9px) translateX(31px)', offset: 0.2 }),
            style({ transform: 'rotateZ(223deg) translateY(9px) translateX(31px)', offset: 0.4 }),
            style({ transform: 'rotateZ(136deg) translateY(9px) translateX(19px)', offset: 0.6 }),
            style({ transform: 'rotateZ(44deg) translateY(-8px) translateX(19px)', offset: 0.8 }),
            style({ transform: 'rotateZ(0deg) translateY(0px) translateX(0px)', offset: 1 }),
        ]))
        )
    ])
];