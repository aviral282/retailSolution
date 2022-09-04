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
    // throw new Error('Method not implemented.');
    this.addEmployee();
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

  get g() { return this.employeeForm.controls; }


  newEmployee(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      hoursWorked: ['', [Validators.required]],
    })
  }

  addEmployee() {
    this.employees().push(this.newEmployee());
  }

  removeEmployee(i: number) {
    this.employees().removeAt(i);
  }

  onSubmit() {
    this.results = [];
    this.block = false;
    // this.submitted = true;


    console.log(this.employeeForm.value.employees);
    let empArr: [] = this.employeeForm.value.employees;
    empArr.forEach(i => {
      console.log('i', i);
      switch (i['type']) {
        case "manager":
          // 15mins break per hour worked
          let manager = this.userService.getUserType('manager');
          let timeoffMinurePerHour = Math.floor(i['hoursWorked'] * manager.breakTime);
          let q: employeeReslts = {
            name: i['name'],
            type: manager.type,
            workHours: i['hoursWorked'],
            hoursWorked: timeoffMinurePerHour
          }
          this.results.push(q);
          console.table({
            'name': i['name'],
            'Total Time off': timeoffMinurePerHour,
          })
          break;

        case "employee":
          //10mins break per hour worked
          //For every 4 hours they get an additional 10min break
          let employee = this.userService.getUserType('employee');

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
          console.table({
            'name': i['name'],
            'Total Time off': totalTime,
          })
          break;

        case "nightshiftworker":
          //For every 2 hours they get an additional 10min break 
          let nightShiftWork = this.userService.getUserType('nightshift');


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

          console.table({
            'name': i['name'],
            'Total Time off': totalTimeEmp,
          })
          break;

        default:
          // 

          break;
      }
    });
    this.block = true;
    console.log('this.results allarr', this.results);
  }

}
