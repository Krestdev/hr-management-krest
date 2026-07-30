"use client"

import Header from "@/components/header";
import SettingsGroup, { SettingGroupProps } from "@/components/settings-group";
import { Box } from "lucide-react";

const ReferentielsPage = () => {

    const links: SettingGroupProps["links"] = [
        {
            title: "Type de Congés",
            description:
                "Gérer les différents types de congés.",
            icon: Box,
            href: "/tableau-de-bord/referentiels/type-de-conges",
            color: "purple",
            auth: ["ADMIN", "SUPERADMIN"],
        }
    ];


    return (
        <div className="content">
            <Header
                title="Référentiels"
            />
            <SettingsGroup links={links} />
        </div>
    );
};

export default ReferentielsPage;