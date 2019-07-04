import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { City } from 'src/models/city';
import { Employee } from 'src/models/employee';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  employeeForm: FormGroup;
  title = 'Create';
  employeeId: number;
  errorMessage: any;
  cityList: City[];

  constructor(private _fb: FormBuilder, private _avRoute: ActivatedRoute,
    private _employeeService: EmployeeService, private _router: Router) {
    if (this._avRoute.snapshot.params['id']) {
      this.employeeId = this._avRoute.snapshot.params['id'];
    }

    this.employeeForm = this._fb.group({
      employeeId: 0,
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      department: ['', [Validators.required]],
      city: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    this._employeeService.getCityList().subscribe(
      (data: City[]) => this.cityList = data
    );

    if (this.employeeId > 0) {
      this.title = 'Edit';
      this._employeeService.getEmployeeById(this.employeeId)
        .subscribe((response: Employee) => {
          this.employeeForm.setValue(response);
        }, error => console.error(error));
    }
  }

  save() {

    if (!this.employeeForm.valid) {
      return;
    }

    if (this.title === 'Create') {
      this._employeeService.saveEmployee(this.employeeForm.value)
        .subscribe(() => {
          this._router.navigate(['/fetch-employee']);
        }, error => console.error(error));
    } else if (this.title === 'Edit') {
      this._employeeService.updateEmployee(this.employeeForm.value)
        .subscribe(() => {
          this._router.navigate(['/fetch-employee']);
        }, error => console.error(error));
    }
  }

  cancel() {
    this._router.navigate(['/fetch-employee']);
  }

  get name() { return this.employeeForm.get('name'); }
  get gender() { return this.employeeForm.get('gender'); }
  get department() { return this.employeeForm.get('department'); }
  get city() { return this.employeeForm.get('city'); }
}
