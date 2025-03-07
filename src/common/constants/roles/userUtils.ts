// userUtils.ts
import { UserRole } from './roles';

export const isCustomer = (role: string): boolean => {
    return role === UserRole.Customer;
};

export const isOperations = (role: string): boolean => {
    return role === UserRole.Operations;
}
