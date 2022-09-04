import { Injectable } from "@angular/core";

interface employeeCriteria {
    type: string;
    breakTime: number;
    additionalBreakTimeHours: number
}

@Injectable()
export class UserService {

    userToReturn: employeeCriteria | undefined;

    getUserType(type: string) {

        switch (type) {
            case "manager":

                this.userToReturn = {
                    type: 'manager',
                    breakTime: 15,
                    additionalBreakTimeHours: 0
                }
                return this.userToReturn;
            case "employee":
                this.userToReturn = {
                    type: 'employee',
                    breakTime: 10,
                    additionalBreakTimeHours: 4
                }
                return this.userToReturn;

            case "nightshift":
                this.userToReturn = {
                    type: 'nightshift',
                    breakTime: 10,
                    additionalBreakTimeHours: 2
                }
                return this.userToReturn;
            default:
                this.userToReturn = {
                    type: 'nightshift',
                    breakTime: 10,
                    additionalBreakTimeHours: 0
                }
                return this.userToReturn;
        }
    }
}