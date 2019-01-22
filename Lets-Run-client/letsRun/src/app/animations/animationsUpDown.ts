import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';
import { delay } from 'rxjs/operators';

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

export const shrinkUpAndDownAnimationField = [
    trigger('shrinkDownUp', [
        state('down', style({
            'max-height': '100%',
            'display': 'block'
        })),
        state('up', style({
            'max-height': '0px',
            'display': 'none'
        })),
        transition('down => up', animate('1s', keyframes([
            style({ 'max-height': '100%', offset: 0 }),
            style({ 'max-height': '80px',offset: 0.2 }),
            style({ 'max-height': '60px',offset: 0.5 }),
            style({ 'max-height': '40px',offset: 0.9 }),
            style({ 'max-height': '0px' ,'display': 'none', offset: 1 })
        ]))

        ),
        transition('up => down', animate('1s', keyframes([
            style({ 'max-height': '0px', 'display': 'none', offset: 0 }),
            style({ 'max-height': '40px','display': 'block',offset: 0.2 }),
            style({ 'max-height': '80px',offset: 0.5 }),
            style({ 'max-height': '100px',offset: 0.9 }),
            style({ 'max-height': '2000px' , offset: 1 })
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
    ]),
    trigger('middle_bar', [
        state('horizontal', style({
            'opacity': '1'
        })),
        state('invisible', style({
            'opacity': '0'
        })),
        transition('horizontal => invisible', animate('.1s', keyframes([
            style({ opacity: 1,  offset: 0 }),
            style({ opacity: 0.8, offset: 0.2 }),
            style({ opacity: 0.6, offset: 0.4 }),
            style({ opacity: 0.4, offset: 0.6 }),
            style({ opacity: 0.2, offset: 0.8 }),
            style({ opacity: 0, offset: 1 }),
        ]))

        ),
        transition('invisible => horizontal', animate('.3s', keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 0.2, offset: 0.2 }),
            style({ opacity: 0.4, offset: 0.4 }),
            style({ opacity: 0.6, offset: 0.6 }),
            style({ opacity: 0.8, offset: 0.8 }),
            style({ opacity: 1, offset: 1 }),
        ]))
        )
    ]),
    trigger('menu', [
        state('invisible', style({
            opacity: '0',
            width: '0',
            transform: 'translateX(50vw)'
        })),
        state('fullWidhth', style({
            opacity: '0.9',
            width: '100%',
            transform: 'translateX(0vw)'
        })),
        transition('invisible => fullWidhth', animate('.3s', keyframes([
            style({ opacity: 0, width: '0', transform: 'translateX(50vw)',  offset: 0 }),
            style({ opacity: 0.2, width: '20%', transform: 'translateX(40vw)', offset: 0.2 }),
            style({ opacity: 0.4, width: '40%', transform: 'translateX(30vw)', offset: 0.4 }),
            style({ opacity: 0.6, width: '60%', transform: 'translateX(20vw)', offset: 0.6 }),
            style({ opacity: 0.8, width: '80%', transform: 'translateX(10vw)', offset: 0.8 }),
            style({ opacity: 0.9, width: '100%', transform: 'translateX(0vw)', offset: 1 }),
        ]))

        ),
        transition('fullWidhth => invisible', animate('.3s', keyframes([
            style({ opacity: 0.9, width: '100%', transform: 'translateX(0vw)', offset: 0 }),
            style({ opacity: 0.8, width: '80%', transform: 'translateX(10vw)', offset: 0.2 }),
            style({ opacity: 0.6, width: '60%', transform: 'translateX(20vw)', offset: 0.4 }),
            style({ opacity: 0.4, width: '40%', transform: 'translateX(30vw)', offset: 0.6 }),
            style({ opacity: 0.2, width: '20%', transform: 'translateX(40vw)', offset: 0.8 }),
            style({ opacity: 0, width: '0', transform: 'translateX(50vw)', offset: 1 }),
        ]))
        )
    ]),
    trigger('links', [
        state('invisible', style({
            transform: 'translateY(-10000px)'
        })),
        state('showed', style({
            transform: 'translateY(0px)'
        })),
        transition('invisible => showed', animate('1s', keyframes([
            style({ transform: 'translateY(-10000px)',  offset: 0 }),
            style({ transform: 'translateY(0)', offset: 0.38 }),
            style({ transform: 'translateY(-65px)', offset: 0.55 }),
            style({ transform: 'translateY(0px)', offset: 0.72 }),
            style({ transform: 'translateY(-28px)', offset: 0.81 }),
            style({ transform: 'translateY(-0px)', offset: 0.90 }),
            style({ transform: 'translateY(-8px)', offset: 0.95 }),
            style({ transform: 'translateY(0px)', offset: 1 }),
        ]))

        ),
        transition('showed => invisible', animate('.1s', keyframes([
            style({ transform: 'translateY(0px)',  offset: 0 }),
            style({ transform: 'translateY(-10000px)', offset: 1 }),
        ]))
        )
    ])
];