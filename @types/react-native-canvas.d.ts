declare module 'react-native-canvas' {
    import { Component } from 'react';
    import { ViewProps } from 'react-native';

    interface CanvasProps extends ViewProps {
        ref?: any;
        onContext2D?: (ctx: CanvasRenderingContext2D) => void;
    }

    export default class Canvas extends Component<CanvasProps> {}
} 