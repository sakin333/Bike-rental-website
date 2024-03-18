interface Booking {
    startTime: string,
    endTime: string,
    status: string
}

export class Bike {
    constructor(
        public bike_brand: string,
        public bike_name: string,
        public model_year: string,
        public type: string,
        public price: number,
        public image: string,
        public description: string,
        public _id?: string,
        public booking?: Booking
    ){}
}