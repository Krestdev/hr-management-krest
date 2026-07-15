"use client"

import { roleColors, roleLabels } from "@/types/types"
import { Badge } from "../ui/badge"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { formatDate } from "@/lib/utils"

interface IViewUserDialog {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    employee: any
}

const ViewUserDialog = ({ isOpen, setIsOpen, employee }: IViewUserDialog) => {

    const roleName = employee?.role ? (roleLabels[employee.role] || employee.role) : "-"
    const roleColor = employee?.role ? (roleColors[employee.role] || "bg-gray-500 text-white") : "bg-gray-500 text-white"

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="max-w-[520px] w-full">
                <DialogHeader>
                    <DialogTitle>{"Voir un utilisateur"}</DialogTitle>
                    <DialogDescription>
                        {"Informations relatives à l’utilisateur"}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <div className="w-fit px-1.5 py-1 flex items-center justify-center bg-[#F0F0F0] rounded-full">
                            <p className="text-[10px] text-[#383838]">{"Adresse mail"}</p>
                        </div>
                        <p className="text-sm text-[#383838]">{employee?.user.email || "-"}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="w-fit px-1.5 py-1 flex items-center justify-center bg-[#F0F0F0] rounded-full">
                            <p className="text-[10px] text-[#383838]">{"Nom"}</p>
                        </div>
                        <p className="text-sm text-[#383838]">
                            {employee ? `${employee.firstName || ""} ${employee.lastName || ""}`.trim() : "-"}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="w-fit px-1.5 py-1 flex items-center justify-center bg-[#F0F0F0] rounded-full">
                            <p className="text-[10px] text-[#383838]">{"Rôle"}</p>
                        </div>
                        <Badge className={`font-normal ${roleColor}`} variant="outline">
                            {roleName}
                        </Badge>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="w-fit px-1.5 py-1 flex items-center justify-center bg-[#F0F0F0] rounded-full">
                            <p className="text-[10px] text-[#383838]">{"Crée le"}</p>
                        </div>
                        <p className="text-sm text-[#383838]">{formatDate(employee?.user.createdAt)}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="w-fit px-1.5 py-1 flex items-center justify-center bg-[#F0F0F0] rounded-full">
                            <p className="text-[10px] text-[#383838]">{"Modifié le"}</p>
                        </div>
                        <p className="text-sm text-[#383838]">{formatDate(employee?.user.updatedAt)}</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>
                            {"Fermer"}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewUserDialog