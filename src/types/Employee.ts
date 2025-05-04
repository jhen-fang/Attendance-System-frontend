export interface EmployeeDTO {
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  roleIds: number[];
  roleNames: string[];
  departmentId: number;
  positionId: number;
  supervisorEmployeeCode: string;
  supervisorEmployeeName: string;
  hireDate: string;
  monthOfService: number;
  departmentName: string;
  positionName: string;
}
