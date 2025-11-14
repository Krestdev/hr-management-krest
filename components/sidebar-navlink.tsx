import { cn } from '@/lib/utils';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { SidebarMenuButton } from './ui/sidebar';

interface Props {
    children: React.ReactNode;
    href: string;
    className?: string;
}

function SidebarNavlink({children, href, className=""}:Props) {
    const path = usePathname();
    const isActive = path === href;
  return (
    <SidebarMenuButton>
        <Link href={href}>{children}</Link>

    </SidebarMenuButton>
  )
}

export default SidebarNavlink