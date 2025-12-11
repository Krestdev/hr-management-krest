'use client'
import EmployeeForm from '@/components/employee-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Employee } from '@/types/types';
import React from 'react'

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  employee: Employee;
  users: Array<Employee>;
};

function EditProfile({isOpen, openChange, employee, users}:Props) {
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
                <DialogTitle>{"Modifier le profil"}</DialogTitle>
                <DialogDescription/>
            </DialogHeader>
            <div className="grid gap-4">
              <EmployeeForm employee={employee} users={users} />
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default EditProfile