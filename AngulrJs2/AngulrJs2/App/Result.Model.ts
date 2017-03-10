export class Result<T> {
    isErr: boolean;
    isErrUnandleException: boolean;
    titleErr: string;
    desc: string;
    model: T;
}

export class CKeyValue{
    id: string;
    name: string;
}


export class ResultModel {
    isErr: boolean;
    isErrUnandleException: boolean;
    titleErr: string;
    desc: string;
}