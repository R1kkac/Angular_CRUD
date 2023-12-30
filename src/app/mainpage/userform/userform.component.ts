import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RoleView } from 'src/app/class/Role-View.model';
import { AuthService } from 'src/app/service/auth.service';


@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.scss']
})
export class UserformComponent {
  currentImage: string | ArrayBuffer | null = null;
  empForm: FormGroup;
  Image: File | null = null;
  rolesList: RoleView[] = [];
  currentUserRoles: string[] = []; 

  
  constructor(private _fb:FormBuilder,private _dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data:any,private authService: AuthService){
    this.empForm = this._fb.group({
      id:'',
      name:'',
      userName:'',
      email:'',
      phoneNumber:'',
      role:[[]],
      avatar:''
    });
  }


ngOnInit(): void {
      this.loadRolesList();
      this.loadUsersData(this.data.id);
      this.empForm.get('name')?.disable();
      this.empForm.get('userName')?.disable();
      this.empForm.get('email')?.disable();
      this.empForm.get('phoneNumber')?.disable();
}


loadUsersData(userId: string) {
  this.authService.getUserInfo(userId).subscribe({
    next: (userData) => {
      if (userData) {
        this.empForm.patchValue({
          // Đặt các giá trị trừ 'Image'
          name: userData.name,
          userName: userData.userName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        });
        this.currentImage = userData.avatar; // Lưu URL hình ảnh để hiển thị
        this.loadUserRoles(userId); // Tải vai trò của người dùng
      }
    },
    error: (error) => {
      console.error('Không thể tải dữ liệu người dùng:', error);
    }
  });

}


loadUserRoles(userId: string) {
  this.authService.getUserRoles(userId).subscribe({
    next: (rolesData) => {
      if (rolesData) {
        // Nếu bạn muốn thiết lập nhiều vai trò, sử dụng rolesData.map để lấy danh sách id
        // this.empForm.get('role')?.setValue(rolesData.map(role => role.id));
        const roleIds = rolesData.map(role => role.id);
        this.empForm.get('role')?.setValue(roleIds);
        this.currentUserRoles = roleIds; // Cập nhật danh sách vai trò hiện tại
      }
    },
    error: (error) => {
      console.error('Không thể tải dữ liệu vai trò:', error);
    }
  });
}

loadRolesList() {
  this.authService.getRolesList().subscribe({
    next: (data) => {
      this.rolesList = data;
    },
    error: (err) => {
      console.error('Lỗi khi tải danh sách roles:', err);
    }
  });
}

onFormSubmit(): void {
  const userId = this.data.id; // Giả sử userId được lấy từ data
  const selectedRoleIds = this.empForm.value.role; // Lấy danh sách ID vai trò đã chọn từ form

  // Xác định các vai trò cần thêm
  const rolesToAdd = selectedRoleIds.filter((roleId:string) => !this.currentUserRoles.includes(roleId));

  // Xác định các vai trò cần xóa
  const rolesToRemove = this.currentUserRoles.filter(roleId => !selectedRoleIds.includes(roleId));

  // Thêm các vai trò mới
  rolesToAdd.forEach((roleId:string) => {
    const role = this.rolesList.find(r => r.id === roleId)?.name;
    if (role) {
      this.authService.addRoleToUser(userId, role).subscribe({
        next: response => console.log('Role added successfully:', response),
        error: error => console.error('Error adding role:', error)
      });
    }
  });

  // Xóa các vai trò không còn được chọn
  rolesToRemove.forEach(roleId => {
    const role = this.rolesList.find(r => r.id === roleId)?.name;
    if (role) {
      this.authService.deleteRoleFromUser(userId, role).subscribe({
        next: response => console.log('Role removed successfully:', response),
        error: error => console.error('Error removing role:', error)
      });
    }
  });
  alert('Cập nhập vai trò thành công');
  this.closeAddEditForm();
}

  closeAddEditForm(){
    this._dialog.closeAll();
  } 
}
