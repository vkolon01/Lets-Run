export interface Weather {
    temp_c: string;
    date?: string;
    condition: {
        text: string,
        icon: string
    }
}