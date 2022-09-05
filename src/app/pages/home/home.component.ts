import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms'
import { UserService } from './users';

interface employeeReslts {
  name: string;
  type: string;
  workHours: number;
  hoursWorked: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  block = false;
  submitted = false;

  results: employeeReslts[] = [];
  ngOnInit(): void {
    this.addEmployee();  // call once to initiate one field
  }

  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.employeeForm = this.fb.group({
      employees: this.fb.array([]),
    });
  }

  employees(): FormArray {
    return this.employeeForm.get("employees") as FormArray
  }

  get g() { return this.employeeForm.controls; }   // Easy to grab in html


  newEmployee(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      hoursWorked: ['', [Validators.required]],
    })
  }

  addEmployee() { // add in dynamic input
    this.employees().push(this.newEmployee());
  }

  removeEmployee(i: number) {  // Remove from dynamic input
    this.employees().removeAt(i);
  }

  onSubmit() {
    this.results = [];
    this.block = false;

    let empArr: [] = this.employeeForm.value.employees;
    empArr.forEach(i => {
      switch (i['type']) {
        case "manager":
          // 15mins break per hour worked
          let manager = this.userService.getUserType('manager'); // Get user from service & popluate the add values
          // Can add a boolean to service in future for extrahours as it is not present for manager
          let timeoffMinurePerHour = Math.floor(i['hoursWorked'] * manager.breakTime);
          let q: employeeReslts = {
            name: i['name'],
            type: manager.type,
            workHours: i['hoursWorked'],
            hoursWorked: timeoffMinurePerHour
          }
          this.results.push(q);
          break;

        case "employee":
          //10mins break per hour worked
          //For every 4 hours they get an additional 10min break
          let employee = this.userService.getUserType('employee'); // Get user from service & popluate the add values

          let timeoffMinurePerHourEmp = Math.floor(i['hoursWorked'] * employee.breakTime);
          let extra4Hours = Math.floor((i['hoursWorked'] / employee.additionalBreakTimeHours) * 10)
          let totalTime = timeoffMinurePerHourEmp + extra4Hours;

          let emp: employeeReslts = {
            name: i['name'],
            type: employee.type,
            workHours: i['hoursWorked'],
            hoursWorked: totalTime
          }
          this.results.push(emp);
          break;

        case "nightshiftworker":
          //For every 2 hours they get an additional 10min break 
          let nightShiftWork = this.userService.getUserType('nightshift');  // Get user from service & popluate the add values

          let timeoffMinurePerHourNight = Math.floor(i['hoursWorked'] * nightShiftWork.breakTime);
          let extra2Hours = Math.floor((i['hoursWorked'] / nightShiftWork.additionalBreakTimeHours) * 10)
          let totalTimeEmp = timeoffMinurePerHourNight + extra2Hours;

          let nightShift: employeeReslts = {
            name: i['name'],
            type: i['type'],
            workHours: i['hoursWorked'],
            hoursWorked: totalTimeEmp
          }
          this.results.push(nightShift);
          break;

        default:
          console.log('not recognized !');
          break;
      }
    });
    this.block = true;

  }
}
