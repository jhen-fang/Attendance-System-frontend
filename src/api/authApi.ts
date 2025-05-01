import axios from 'axios';

/** 使用者登入 */
export async function login(employeeCode: string, password: string) {
    const response = await axios.post('http://localhost:8080/api/auth/login', {
        employeeCode,
        password,
    });
    return response.data;
}