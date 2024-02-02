
export class CommonResponseDto {
    constructor(
        public success: boolean,
        public message: string,
        public data: any,
    ) { }
}

export class ErrorResponseDto extends CommonResponseDto {
    constructor(public success: boolean, public message: string, data?: any) {
        super(false, message, data)
    }
}

export class SuccessResponseDto extends CommonResponseDto {
    constructor(messageOrData?: string | any, data?: any) {
        if (typeof messageOrData === 'string') {
            super(true, messageOrData, data);
        } else {
            super(true, "Success", messageOrData);
        }
    }
}