'use strict';

const VEHICLE_STATUSES = ['available', 'in_use', 'maintenance', 'retired'];
const VEHICLE_BRANDS   = ['Toyota', 'Honda', 'Ford', 'Mazda', 'Nissan', 'Mitsubishi', 'BMW', 'Mercedes-Benz', '其他'];
const VEHICLE_COLORS   = ['白色', '銀色', '黑色', '灰色', '紅色', '藍色', '棕色', '橘色', '黃色', '綠色', '其他'];
const DEPARTMENTS = ['業務部', '工程部', '管理部', '資訊部', '財務部'];
const USER_ROLES = ['admin', 'user'];

module.exports = { VEHICLE_STATUSES, VEHICLE_BRANDS, VEHICLE_COLORS, DEPARTMENTS, USER_ROLES };
