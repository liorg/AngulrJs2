export class orderFlightPostponedRequest {
    flight: string;
    handleBy: string;
    orderid: string;
    uniqueTranId: string;
    passangers: string[];
}

export interface passengerExtra {
    id: string;
    className: string;
    seat: string;
    title: string;
    email: string;
    phone: string;
}